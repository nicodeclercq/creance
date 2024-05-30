import { pipe } from "fp-ts/es6/pipeable";
import { map, Either, either, right } from "fp-ts/es6/Either";
import { sequenceS } from "fp-ts/es6/Apply";

import { sort } from "../utils/number";
import { Distribution, Expense } from "../models/Expense";
import { Creance } from "../models/State";
import { User } from "../models/User";
import { Registered } from "../models/Registerable";
import * as Users from "./UserService";
import * as Sum from "../models/Sum";

const getDistributionSliceCount = (distribution: Distribution) => {
  return Object.values(distribution).map(Sum.of).reduce(Sum.concat, Sum.empty())
    .value;
};

export const getExpenseDistributionByAmount = (
  expense: Expense
): { [userId: string]: number } => {
  const getExpenseDistributionAmount = (
    amount: number,
    slice: number,
    sliceCount: number
  ) => (amount * slice) / sliceCount;
  const sliceCount = getDistributionSliceCount(expense.distribution);
  return Object.entries(expense.distribution).reduce((acc, [userId, slice]) => {
    const amount = getExpenseDistributionAmount(
      expense.amount,
      slice,
      sliceCount
    );

    return {
      ...acc,
      [userId]: amount,
    };
  }, {});
};

export const getTotalAmount = (expenses: Expense[]) =>
  expenses
    .map((expense) => Sum.of(expense.amount))
    .reduce(Sum.concat, Sum.empty()).value;

export const getTotalExpense = (state: Creance) => () =>
  getTotalAmount(state.expenses);

export type UserDistribution = {
  distribution: {
    amount: number;
    expense: Registered<Expense>;
  }[];
  total: number;
};

export const expensesDistribution = (expenses: Expense[]) =>
  expenses.map(getExpenseDistributionByAmount).reduce(
    (acc, cur) =>
      Object.entries(cur)
        .map(
          ([userId, amount]) =>
            [
              userId,
              (userId in acc ? (acc[userId] as number) : 0) + amount,
            ] as const
        )
        .reduce(
          (acc, [userId, amount]) => ({
            ...acc,
            [userId]: amount,
          }),
          {} as { [userId: string]: number }
        ),
    {} as { [userId: string]: number }
  );

export const getUserCost =
  (state: Creance) =>
  (id: string): Either<Error, UserDistribution> =>
    pipe(
      Users.get(state)(id),
      map((user: Registered<User>) => {
        const distribution = state.expenses
          .filter((expense) => user.id in expense.distribution)
          .map((expense) => {
            const userDistribution = expense.distribution[user.id];
            return {
              amount: userDistribution
                ? (expense.amount * userDistribution) /
                  getDistributionSliceCount(expense.distribution)
                : 0,
              expense,
            };
          })
          .filter((a) => a.amount !== 0);

        const total = distribution
          .map((a) => Sum.of(a.amount))
          .reduce(Sum.concat, Sum.empty()).value;

        return { distribution, total };
      })
    );

export const getUsersCosts = (state: Creance) => () =>
  pipe(state.users, (users) =>
    users.reduce(
      (acc, user) => ({ ...acc, [user.id]: getUserCost(state)(user.id) }),
      {} as { [key: string]: Either<Error, UserDistribution> }
    )
  );

export const getUsersExpenses = (state: Creance) => () =>
  pipe(state.users, (users) =>
    users
      .map((user) => ({
        user,
        expense: state.expenses
          .filter((expense) => expense.from === user.id)
          .map((expense) => Sum.of(expense.amount))
          .reduce(Sum.concat, Sum.empty()),
      }))
      .reduce(
        (acc, { user, expense }) => ({ ...acc, [user.id]: expense.value }),
        {} as { [userId: string]: number }
      )
  );

export type Credit = {
  user: string;
  amount: number;
};
export type CreditDistribution = {
  user: string;
  notDistributed: number;
  distribution: Credit[];
};
const getUsersDistribution = (
  credits: Credit[]
): Omit<CreditDistribution, "notDistributed">[] => {
  const getSides = (credits: CreditDistribution[]) => {
    const [lower, ...rest] = credits.sort((a, b) =>
      sort(a.notDistributed, b.notDistributed)
    );

    return {
      upper: rest[rest.length - 1],
      lower,
      middle: rest.slice(0, -1),
    };
  };
  const getDiff = (credit: number, debt: number) => {
    const creditAbs = Math.abs(credit);
    const debtAbs = Math.abs(debt);
    if (creditAbs > debtAbs) {
      return debtAbs;
    }
    return creditAbs;
  };
  const isDistributionDone = (credit: CreditDistribution) =>
    Math.floor(credit.notDistributed * 100) / 100 === 0;
  const not =
    <A>(predicate: (a: A) => boolean) =>
    (param: A) =>
      !predicate(param);
  const init = credits.map(
    ({ user, amount }) => ({
      user,
      notDistributed: amount,
      distribution: [],
    }),
    [] as CreditDistribution[]
  );

  const compute = (init: CreditDistribution[]): CreditDistribution[] => {
    const distributed = init.filter(isDistributionDone);
    if (distributed.length === init.length) {
      return distributed;
    }

    const notDistributed = init.filter(not(isDistributionDone));
    const { lower, upper, middle } = getSides(notDistributed);

    const amount = getDiff(upper?.notDistributed || 0, lower.notDistributed);
    return upper
      ? [
          ...distributed,
          ...compute([
            ...middle,
            {
              ...lower,
              notDistributed: lower.notDistributed + amount,
              distribution: [
                ...lower.distribution,
                { user: upper?.user, amount: amount / 100 },
              ],
            },
            {
              ...upper,
              notDistributed: upper.notDistributed - amount,
              distribution: [
                ...upper.distribution,
                { user: lower.user, amount: -amount / 100 },
              ],
            },
          ]),
        ]
      : [
          // Calculation approximation error with float
          ...distributed,
          ...middle,
          {
            ...lower,
            notDistributed: lower.notDistributed + amount,
            distribution: [
              ...lower.distribution,
              { user: upper?.user, amount },
            ],
          },
        ];
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return compute(init).map(({ notDistributed, ...dist }) => ({
    ...dist,
    distribution: dist.distribution
      .filter((a) => a.amount !== 0) // Calculation approximation error with float
      .sort((a, b) => sort(b.amount, a.amount)),
  }));
};

export const getUsersRepartition =
  (state: Creance) =>
  (): Either<Error, Omit<CreditDistribution, "notDistributed">[]> => {
    const usersCost = getUsersCosts(state)();
    const usersExpense = getUsersExpenses(state)();

    if (Object.keys(usersCost).length && Object.keys(usersExpense).length) {
      return pipe(
        sequenceS(either)(usersCost),
        map((c) =>
          Object.entries(c).map(
            ([userId, userCost]: [string, UserDistribution]) => ({
              user: userId,
              amount: Math.floor((userCost.total - usersExpense[userId]) * 100),
            })
          )
        ),
        map(getUsersDistribution)
      );
    }
    return right([]);
  };
