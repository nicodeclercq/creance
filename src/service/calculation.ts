import * as ArrayFP from "fp-ts/Array";
import * as Either from "fp-ts/Either";

import { CustomUserShare, Event, foldUserShare } from "../models/Event";

import { Expense } from "../models/Expense";
import { Period } from "../models/Period";
import { User } from "../models/User";
import { calculationAsNumber } from "../helpers/Number";
import { pipe } from "fp-ts/function";
import { sequence } from "../ui/Either";

export function getTotalAmount(
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

export function getAmountByCategory(
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

function getHalfDaysCount(period: Period): number {
  const oneDay = 24 * 60 * 60 * 1000;
  const timeDiff = Math.abs(period.end.getTime() - period.start.getTime());
  const daysCount = Math.ceil(timeDiff / oneDay);
  const arrivalOffset = period.arrival === "AM" ? -1 : 0;
  const departureOffset = period.departure === "PM" ? -1 : 0;
  const result = daysCount * 2 + arrivalOffset + departureOffset;
  return result === 0 ? 1 : result; // Ensure at least one half-day
}

function getDefaultUserShareCount(period: Period, user: User) {
  return pipe(
    period,
    getHalfDaysCount,
    (count) => count * (user.share.adults * 2 + user.share.children)
  );
}

function getCustomUserShareCount(shares: CustomUserShare) {
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

function getDefaultExpenseShares(
  expense: Expense,
  event: Event,
  users: Record<string, User>
): Either.Either<Error, Record<string, number>> {
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
              totalCounts === 0 ? 0 : (totalAmount * count) / totalCounts,
            ])
          )
        )
      )
  );
}

function getPercentageExpenseShares(
  expense: Expense,
  distribution: Record<string, string>,
  users: Record<string, User>
): Either.Either<Error, Record<string, number>> {
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

function getFixedExpenseShares(
  distribution: Record<string, string>,
  users: Record<string, User>
): Either.Either<Error, Record<string, number>> {
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

export function getExpenseShares(
  expense: Expense,
  event: Event,
  users: Record<string, User>
): Either.Either<Error, Record<string, number>> {
  return pipe(expense.share, (share) => {
    switch (share.type) {
      case "default":
        return getDefaultExpenseShares(expense, event, users);
      case "fixed":
        return getFixedExpenseShares(share.distribution, users);
      case "percentage":
        return getPercentageExpenseShares(expense, share.distribution, users);
    }
  });
}

type EventShare = Pick<
  Expense,
  "amount" | "category" | "date" | "lender" | "reason"
> & {
  shares: Record<string, number>;
};

export function getEventShares(
  event: Event,
  expenses: Record<string, Expense>,
  users: Record<string, User>
): Either.Either<Error, Readonly<EventShare[]>> {
  return pipe(
    event.expenses.map((expenseId) => expenses[expenseId]),
    (expenses) =>
      expenses.map((expense) =>
        pipe(
          getExpenseShares(expense, event, users),
          Either.map((shares) => ({
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

type EventShareByUser = Omit<EventShare, "shares"> & { share: number };

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
}): Either.Either<Error, EventShareByUser[]> {
  return pipe(
    getEventShares(event, expenses, users),
    Either.map((expenses) =>
      expenses.map((expense) => ({
        ...expense,
        share: expense.shares[userId],
      }))
    ),
    Either.map((expenses) => expenses.filter((expense) => expense.share > 0))
  );
}

export function getEventSharesByUserAndCategory({
  shares,
}: {
  shares: Either.Either<Error, EventShareByUser[]>;
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

export function getUserTotalReceivableAmount({
  shares,
}: {
  shares: EventShareByUser[];
}) {
  return shares.reduce((acc, { share }) => acc + share, 0);
}

export type Distribution = {
  type: "give" | "receive";
  amount: number;
  user: string;
};

export function getEventDistribution(
  event: Event,
  expenses: Record<string, Expense>,
  users: Record<string, User>
): Either.Either<Error, Record<string, Distribution[]>> {
  const usersTotalDueAmount = Object.keys(users).reduce(
    (acc, userId) =>
      pipe(
        getEventSharesByUser({ event, expenses, userId, users }),
        Either.map((shares) => ({
          [userId]: getUserTotalReceivableAmount({ shares }),
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
    sequence({ usersTotalDueAmount, usersTotalPayedAmount }),
    Either.map(({ usersTotalDueAmount, usersTotalPayedAmount }) => {
      const remainingDue = Object.keys(users).reduce(
        (acc, userId) => ({
          ...acc,
          [userId]: usersTotalDueAmount[userId] - usersTotalPayedAmount[userId],
        }),
        {} as Record<string, number>
      );

      const sortedUsers = Object.keys(remainingDue).sort(
        (a, b) => remainingDue[b] - remainingDue[a]
      );

      // create distribution array for each user least payed giving to most payed first
      return sortedUsers.reduce(
        ({ distributions, remainingDiff }, userId) => {
          sortedUsers.reduceRight((remainingAmount, otherUserId) => {
            if (remainingAmount <= 0) return remainingAmount;

            if (!(userId in distributions)) {
              distributions[userId] = [];
            }
            if (!(otherUserId in distributions)) {
              distributions[otherUserId] = [];
            }

            let newAmount = remainingAmount;
            if (remainingAmount > 0) {
              // user owes money
              if (remainingDue[otherUserId] < 0) {
                const exchangeAmount = Math.min(
                  Math.abs(remainingDue[otherUserId]),
                  remainingAmount
                );
                newAmount -= exchangeAmount;
                // user gives money to other
                distributions[userId].push({
                  type: "give",
                  amount: exchangeAmount,
                  user: otherUserId,
                });
                distributions[otherUserId].push({
                  type: "receive",
                  amount: exchangeAmount,
                  user: userId,
                });
              }
            } else {
              // user is owed money
              if (remainingDue[otherUserId] > 0) {
                // user receives money from other
                const exchangeAmount = Math.min(
                  Math.abs(remainingDue[otherUserId]),
                  remainingAmount
                );
                newAmount -= exchangeAmount;
                // user gives money to other
                distributions[userId].push({
                  type: "receive",
                  amount: exchangeAmount,
                  user: otherUserId,
                });
                distributions[otherUserId].push({
                  type: "give",
                  amount: exchangeAmount,
                  user: userId,
                });
              }
            }
            return newAmount;
          }, remainingDue[userId]);

          return { distributions, remainingDiff };
        },
        { distributions: {}, remainingDiff: remainingDue } as {
          distributions: Record<string, Distribution[]>;
          remainingDiff: Record<string, number>;
        }
      ).distributions;
    })
  );
}
