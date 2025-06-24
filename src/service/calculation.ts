import * as ArrayFP from "fp-ts/Array";
import * as Either from "fp-ts/Either";

import { CustomUserShare, Event, foldUserShare } from "../models/Event";

import { Deposit } from "../models/Deposit";
import { Expense } from "../models/Expense";
import { Period } from "../models/Period";
import { User } from "../models/User";
import { calculationAsNumber } from "../helpers/Number";
import { pipe } from "fp-ts/function";
import { sequence } from "../ui/Either";

export function getTotalExpenseAmount(
  expenses: Expense[]
): Either.Either<Error, number> {
  return expenses.reduce(
    (acc: Either.Either<Error, number>, expense: Expense) =>
      pipe(
        calculationAsNumber(expense.amount),
        Either.chain((value) =>
          pipe(
            acc,
            Either.map((a) => a + value)
          )
        )
      ),
    Either.right(0) as Either.Either<Error, number>
  );
}

export function getExpenseAmountByCategory(
  expenses: Expense[]
): Either.Either<Error, Record<string, number>> {
  return expenses.reduce(
    (acc: Either.Either<Error, Record<string, number>>, expense: Expense) =>
      pipe(
        acc,
        Either.chain((accValue) => {
          const category = expense.category;
          const amount = calculationAsNumber(expense.amount);

          return pipe(
            amount,
            Either.map((value) => ({
              ...accValue,
              [category]: (accValue[category] || 0) + value,
            }))
          );
        })
      ),
    Either.right({}) as Either.Either<Error, Record<string, number>>
  );
}

export function getHalfDaysCount(period: Period): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const timeDiff = Math.abs(period.end.getTime() - period.start.getTime());
  const daysCount = Math.ceil(timeDiff / oneDay);
  const arrivalOffset = period.arrival === "AM" ? 1 : 0;
  const departureOffset = period.departure === "PM" ? 1 : 0;
  const result = daysCount * 2 + arrivalOffset + departureOffset;
  return result === 0 ? 1 : result; // Ensure at least one half-day
}

export function getDefaultUserShareCount(period: Period, user: User) {
  return pipe(
    period,
    getHalfDaysCount,
    (count) => count * (user.share.adults * 2 + user.share.children)
  );
}

export function getCustomUserShareCount(shares: CustomUserShare) {
  return pipe(shares.shares, (shares) =>
    shares.reduce((count, share) => {
      const daysCount = getHalfDaysCount(share.period);

      return (
        count +
        daysCount * (share.multiplier.adults * 2 + share.multiplier.children)
      );
    }, 0)
  );
}

function getTotalCount(counts: Record<string, number>) {
  return Object.values(counts).reduce((acc, count) => acc + count, 0);
}

function getDefaultExpenseShares({
  expense,
  event,
  users,
}: {
  expense: Expense;
  event: Event;
  users: Record<string, User>;
}): Either.Either<Error, Record<string, number>> {
  return pipe(
    Object.values(users),
    (users) =>
      users.reduce(
        (counts, user) => ({
          ...counts,
          [user._id]: foldUserShare({
            onDefault: () => getDefaultUserShareCount(event.period, user),
            onCustom: (share) => getCustomUserShareCount(share),
          })(event.shares[user._id]),
        }),
        {} as Record<string, number>
      ),
    (counts) =>
      pipe(
        calculationAsNumber(expense.amount),
        Either.map((totalAmount) => ({
          totalAmount,
          counts,
          totalCounts: getTotalCount(counts),
        })),
        Either.map(({ totalAmount, counts, totalCounts }) =>
          Object.fromEntries(
            Object.entries(counts).map(([userId, count]) => [
              userId,
              totalCounts === 0
                ? 0
                : Math.round((totalAmount * count) / totalCounts),
            ])
          )
        )
      )
  );
}

function getPercentageExpenseShares({
  expense,
  distribution,
  users,
}: {
  expense: Expense;
  distribution: Record<string, string>;
  users: Record<string, User>;
}): Either.Either<Error, Record<string, number>> {
  return pipe(
    Object.values(users),
    (users) =>
      users.reduce(
        (counts, user) =>
          pipe(
            calculationAsNumber(distribution[user._id] ?? "0"),
            Either.chain((share) =>
              pipe(
                counts,
                Either.map((counts) => ({
                  ...counts,
                  [user._id]: share,
                }))
              )
            )
          ),
        Either.right<Error, Record<string, number>>({})
      ),
    Either.chain((counts) =>
      pipe(
        calculationAsNumber(expense.amount),
        Either.map((totalAmount) => ({
          totalAmount,
          counts,
          totalCounts: getTotalCount(counts),
        })),
        Either.map(({ totalAmount, counts, totalCounts }) =>
          Object.fromEntries(
            Object.entries(counts).map(([userId]) => [
              userId,
              totalCounts === 0
                ? 0
                : (totalAmount * counts[userId]) / totalCounts,
            ])
          )
        )
      )
    )
  );
}

function getFixedExpenseShares({
  distribution,
  users,
}: {
  distribution: Record<string, string>;
  users: Record<string, User>;
}): Either.Either<Error, Record<string, number>> {
  return pipe(Object.values(users), (users) =>
    users.reduce(
      (counts, user) =>
        pipe(
          calculationAsNumber(distribution[user._id] ?? "0"),
          Either.chain((amount) =>
            pipe(
              counts,
              Either.map((counts) => ({
                ...counts,
                [user._id]: amount,
              }))
            )
          )
        ),
      Either.right<Error, Record<string, number>>({})
    )
  );
}

export function getExpenseShares({
  expense,
  event,
  users,
}: {
  expense: Expense;
  event: Event;
  users: Record<string, User>;
}): Either.Either<Error, Record<string, number>> {
  return pipe(expense.share, (share) => {
    switch (share.type) {
      case "default":
        return getDefaultExpenseShares({ expense, event, users });
      case "fixed":
        return getFixedExpenseShares({
          distribution: share.distribution,
          users,
        });
      case "percentage":
        return getPercentageExpenseShares({
          expense,
          distribution: share.distribution,
          users,
        });
    }
  });
}

type ExpenseShare = Pick<
  Expense,
  "_id" | "amount" | "category" | "date" | "lender" | "reason"
> & {
  shares: Record<string, number>;
};

function getEventShares({
  event,
  expenses,
  users,
}: {
  event: Event;
  expenses: Record<string, Expense>;
  users: Record<string, User>;
}): Either.Either<Error, Readonly<ExpenseShare[]>> {
  return pipe(
    event.expenses.map((expenseId) => expenses[expenseId]),
    (expenses) =>
      expenses.map((expense) =>
        pipe(
          getExpenseShares({ expense, event, users }),
          Either.map((shares) => ({
            _id: expense._id,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            reason: expense.reason,
            lender: expense.lender,
            shares,
          }))
        )
      ),
    Either.sequenceArray
  );
}

export type ExpenseShareByUser = Omit<ExpenseShare, "shares"> & {
  type: "expense";
  share: number;
};

export function getEventSharesByUser({
  event,
  expenses,
  userId,
  users,
}: {
  event: Event;
  expenses: Record<string, Expense>;
  userId: string;
  users: Record<string, User>;
}): Either.Either<Error, Array<ExpenseShareByUser>> {
  return pipe(
    getEventShares({ event, expenses, users }),
    Either.map((expenses) =>
      expenses.map((expense) => ({
        ...expense,
        type: "expense" as const,
        share: expense.shares[userId],
      }))
    ),
    Either.map((expenses) => expenses.filter((expense) => expense.share > 0))
  );
}

export function getEventSharesByUserAndCategory({
  shares,
}: {
  shares: Either.Either<Error, Array<ExpenseShareByUser>>;
}): Either.Either<Error, Record<string, number>> {
  return pipe(
    shares,
    Either.map((expenses) =>
      expenses.reduce((acc, expense) => {
        const category = expense.category;
        const share = expense.share || 0;
        return { ...acc, [category]: (acc[category] || 0) + share };
      }, {} as Record<string, number>)
    )
  );
}

export type DepositShare = Pick<Deposit, "_id" | "date"> & {
  userId: string;
  share: number;
};

export function getDepositShares({
  event,
  deposits,
  users,
}: {
  event: Event;
  deposits: Record<string, Deposit>;
  users: Record<string, User>;
}): Either.Either<Error, Record<string, DepositShare[]>> {
  const init = Object.keys(users).reduce(
    (acc, userId) => ({ ...acc, [userId]: [] }),
    {} as Record<string, DepositShare[]>
  );

  return pipe(
    event.deposits,
    ArrayFP.map((depositId) => deposits[depositId]),
    ArrayFP.map((deposit) =>
      pipe(
        calculationAsNumber(deposit.amount),
        Either.map((amount) => ({
          _id: deposit._id,
          date: deposit.date,
          from: deposit.from,
          to: deposit.to,
          share: amount,
        }))
      )
    ),
    Either.sequenceArray,
    Either.map((shares) =>
      shares.reduce((acc, { to, from, ...share }) => {
        if (!acc[from]) {
          acc[from] = [];
        }
        if (!acc[to]) {
          acc[to] = [];
        }

        acc[from].push({ ...share, userId: to });
        acc[to].push({
          ...share,
          userId: from,
          share: -share.share,
        });

        return acc;
      }, init)
    )
  );
}

export function getDepositSharesByUsers({
  event,
  deposits,
  users,
  currentUserId,
}: {
  event: Event;
  deposits: Record<string, Deposit>;
  users: Record<string, User>;
  currentUserId: string;
}): Either.Either<Error, number> {
  return pipe(
    getDepositShares({ event, deposits, users }),
    Either.map((shares) => getTotalDepositAmount(shares[currentUserId]))
  );
}

export function getTotalDepositAmount(deposits: DepositShare[]): number {
  return deposits.reduce((sum, deposit) => sum + deposit.share, 0);
}

export function getUserTotalExpenseAmount({
  event,
  expenses,
  userId,
}: {
  event: Event;
  expenses: Record<string, Expense>;
  userId: string;
}): Either.Either<Error, number> {
  return pipe(
    event.expenses.map((expenseId) => expenses[expenseId]),
    ArrayFP.map((expense) =>
      expense.lender === userId
        ? calculationAsNumber(expense.amount)
        : Either.right(0)
    ),
    Either.sequenceArray,
    Either.map((amounts) => amounts.reduce((sum, amount) => sum + amount, 0))
  );
}

export function getUserTotalSharesAmount({
  shares,
}: {
  shares: ExpenseShareByUser[];
}) {
  return shares.reduce((sum, { share }) => sum + share, 0);
}

export type Distribution = {
  type: "give" | "receive";
  amount: number;
  user: string;
};

export function getEventDistribution({
  event,
  expenses,
  deposits,
  users,
}: {
  event: Event;
  expenses: Record<string, Expense>;
  deposits: Record<string, Deposit>;
  users: Record<string, User>;
}): Either.Either<Error, Record<string, Distribution[]>> {
  const usersTotalDueAmount = Object.keys(users).reduce(
    (acc, userId) =>
      pipe(
        getEventSharesByUser({ event, expenses, userId, users }),
        Either.map((shares) => ({
          [userId]: getUserTotalSharesAmount({ shares }),
        })),
        Either.chain((userAmount) =>
          pipe(
            acc,
            Either.map((current) => ({
              ...current,
              ...userAmount,
            }))
          )
        )
      ),
    Either.right<Error, Record<string, number>>({})
  );
  const usersTotalDepositAmount: Either.Either<
    Error,
    Record<string, number>
  > = pipe(
    Object.keys(users),
    ArrayFP.map((userId) =>
      pipe(
        getDepositSharesByUsers({
          event,
          deposits,
          users,
          currentUserId: userId,
        }),
        Either.map((amount) => [userId, amount] as const)
      )
    ),
    Either.sequenceArray,
    Either.map(Object.fromEntries)
  );

  const usersTotalPayedAmount = Object.keys(users).reduce(
    (acc, userId) =>
      pipe(
        getUserTotalExpenseAmount({ event, expenses, userId }),
        Either.chain((userAmount) =>
          pipe(
            acc,
            Either.map((current) => ({
              ...current,
              [userId]: userAmount,
            }))
          )
        )
      ),
    Either.right<Error, Record<string, number>>({})
  );

  return pipe(
    sequence({
      usersTotalDueAmount,
      usersTotalPayedAmount,
      usersTotalDepositAmount,
    }),
    Either.map(
      ({
        usersTotalDueAmount,
        usersTotalPayedAmount,
        usersTotalDepositAmount,
      }) => {
        const mergedPayedAndDepositAmounts = Object.keys(users).reduce(
          (acc, userId) => ({
            ...acc,
            [userId]:
              (usersTotalPayedAmount[userId] || 0) +
              usersTotalDepositAmount[userId],
          }),
          {} as Record<string, number>
        );

        const remainingDue = Object.keys(users).reduce(
          (acc, userId) => ({
            ...acc,
            [userId]:
              usersTotalDueAmount[userId] -
              mergedPayedAndDepositAmounts[userId],
          }),
          {} as Record<string, number>
        );

        const { owingUsers, owedUsers } = Object.keys(remainingDue)
          .sort((a, b) => remainingDue[b] - remainingDue[a])
          .reduce(
            (acc, userId) => {
              const amount = remainingDue[userId];

              if (amount < 0) {
                acc.owedUsers.push({
                  userId,
                  amount: Math.abs(amount),
                });
              } else if (amount > 0) {
                acc.owingUsers.push({
                  userId,
                  amount: Math.abs(amount),
                });
              }
              return acc;
            },
            {
              owingUsers: [] as { userId: string; amount: number }[],
              owedUsers: [] as { userId: string; amount: number }[],
            }
          );

        return owedUsers.reduce((acc, owedUser) => {
          let owedAmount = owedUser.amount;
          if (!acc[owedUser.userId]) {
            acc[owedUser.userId] = [];
          }

          owingUsers.forEach((owingUser) => {
            if (!acc[owingUser.userId]) {
              acc[owingUser.userId] = [];
            }

            if (owedAmount <= 0 || owingUser.amount <= 0) {
              return;
            }

            const amountToTransfer = Math.min(owedAmount, owingUser.amount);
            acc[owedUser.userId].push({
              type: "receive",
              amount: amountToTransfer,
              user: owingUser.userId,
            });
            acc[owingUser.userId].push({
              type: "give",
              amount: amountToTransfer,
              user: owedUser.userId,
            });
            owedAmount -= amountToTransfer;
            owingUser.amount -= amountToTransfer;
          });

          return acc;
        }, {} as Record<string, Distribution[]>);
      }
    )
  );
}
