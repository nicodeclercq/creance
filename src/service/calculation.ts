import * as ArrayFP from "fp-ts/Array";
import * as Either from "fp-ts/Either";

import {
  CustomParticipantShare,
  foldParticipantShare,
} from "../models/ParticipantShare";

import { Deposit } from "../models/Deposit";
import { Event } from "../models/Event";
import { Expense } from "../models/Expense";
import { Participant } from "../models/Participant";
import { Period } from "../models/Period";
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

export function getDefaultParticipantShareCount(
  period: Period,
  participant: Participant
) {
  return pipe(
    period,
    getHalfDaysCount,
    (count) =>
      count * (participant.share.adults * 2 + participant.share.children)
  );
}

export function getCustomParticipantShareCount(shares: CustomParticipantShare) {
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
}: {
  expense: Expense;
  event: Event;
}): Either.Either<Error, Record<string, number>> {
  return pipe(
    Object.values(event.participants),
    (participants) =>
      participants.reduce(
        (counts, participant) => ({
          ...counts,
          [participant._id]: foldParticipantShare({
            onDefault: () =>
              getDefaultParticipantShareCount(event.period, participant),
            onCustom: (share) => getCustomParticipantShareCount(share),
          })(participant.participantShare),
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
            Object.entries(counts).map(([participantId, count]) => [
              participantId,
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
  participants,
}: {
  expense: Expense;
  distribution: Record<string, string>;
  participants: Record<string, Participant>;
}): Either.Either<Error, Record<string, number>> {
  return pipe(
    Object.values(participants),
    (participants) =>
      participants.reduce(
        (counts, participant) =>
          pipe(
            calculationAsNumber(distribution[participant._id] ?? "0"),
            Either.chain((share) =>
              pipe(
                counts,
                Either.map((counts) => ({
                  ...counts,
                  [participant._id]: share,
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
            Object.entries(counts).map(([participantId]) => [
              participantId,
              totalCounts === 0
                ? 0
                : (totalAmount * counts[participantId]) / totalCounts,
            ])
          )
        )
      )
    )
  );
}

function getFixedExpenseShares({
  distribution,
  participants,
}: {
  distribution: Record<string, string>;
  participants: Record<string, Participant>;
}): Either.Either<Error, Record<string, number>> {
  return pipe(Object.values(participants), (participants) =>
    participants.reduce(
      (counts, participant) =>
        pipe(
          calculationAsNumber(distribution[participant._id] ?? "0"),
          Either.chain((amount) =>
            pipe(
              counts,
              Either.map((counts) => ({
                ...counts,
                [participant._id]: amount,
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
}: {
  expense: Expense;
  event: Event;
}): Either.Either<Error, Record<string, number>> {
  return pipe(expense.share, (share) => {
    switch (share.type) {
      case "default":
        return getDefaultExpenseShares({ expense, event });
      case "fixed":
        return getFixedExpenseShares({
          distribution: share.distribution,
          participants: event.participants,
        });
      case "percentage":
        return getPercentageExpenseShares({
          expense,
          distribution: share.distribution,
          participants: event.participants,
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
}: {
  event: Event;
}): Either.Either<Error, Readonly<ExpenseShare[]>> {
  return pipe(
    Object.values(event.expenses),
    (expenses) =>
      expenses.map((expense) =>
        pipe(
          getExpenseShares({ expense, event }),
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

export type ExpenseShareByParticipant = Omit<ExpenseShare, "shares"> & {
  type: "expense";
  share: number;
};

export function getEventSharesByParticipant({
  event,
  participantId,
}: {
  event: Event;
  participantId: string;
}): Either.Either<Error, Array<ExpenseShareByParticipant>> {
  return pipe(
    getEventShares({ event }),
    Either.map((expenses) =>
      expenses.map((expense) => ({
        ...expense,
        type: "expense" as const,
        share: expense.shares[participantId],
      }))
    ),
    Either.map((expenses) => expenses.filter((expense) => expense.share > 0))
  );
}

export function getEventSharesByParticipantAndCategory({
  shares,
}: {
  shares: Either.Either<Error, Array<ExpenseShareByParticipant>>;
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
  participantId: string;
  share: number;
};

export function getDepositShares({
  event,
  participants,
}: {
  event: Event;
  participants: Record<string, Participant>;
}): Either.Either<Error, Record<string, DepositShare[]>> {
  const init = Object.keys(participants).reduce(
    (acc, participantId) => ({ ...acc, [participantId]: [] }),
    {} as Record<string, DepositShare[]>
  );

  return pipe(
    Object.values(event.deposits),
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

        acc[from].push({ ...share, participantId: to });
        acc[to].push({
          ...share,
          participantId: from,
          share: -share.share,
        });

        return acc;
      }, init)
    )
  );
}

export function getDepositSharesByParticipants({
  event,
  participants,
  currentParticipantId,
}: {
  event: Event;
  participants: Record<string, Participant>;
  currentParticipantId: string;
}): Either.Either<Error, number> {
  return pipe(
    getDepositShares({ event, participants }),
    Either.map((shares) => getTotalDepositAmount(shares[currentParticipantId]))
  );
}

export function getTotalDepositAmount(deposits: DepositShare[]): number {
  return deposits.reduce((sum, deposit) => sum + deposit.share, 0);
}

export function getParticipantTotalExpenseAmount({
  event,
  participantId,
}: {
  event: Event;
  participantId: string;
}): Either.Either<Error, number> {
  return pipe(
    Object.values(event.expenses),
    ArrayFP.map((expense) =>
      expense.lender === participantId
        ? calculationAsNumber(expense.amount)
        : Either.right(0)
    ),
    Either.sequenceArray,
    Either.map((amounts) => amounts.reduce((sum, amount) => sum + amount, 0))
  );
}

export function getParticipantTotalSharesAmount({
  shares,
}: {
  shares: ExpenseShareByParticipant[];
}) {
  return shares.reduce((sum, { share }) => sum + share, 0);
}

export function getParticipantTotalExpensesAmount({
  event,
  participantId,
}: {
  event: Event;
  participantId: string;
}): Either.Either<Error, number> {
  return pipe(
    Object.values(event.expenses),
    ArrayFP.map((expense) =>
      expense.lender === participantId
        ? calculationAsNumber(expense.amount)
        : Either.right(0)
    ),
    Either.sequenceArray,
    Either.map((amounts) => amounts.reduce((sum, amount) => sum + amount, 0))
  );
}

export type Distribution = {
  type: "give" | "receive";
  amount: number;
  participant: string;
};

export function getEventDistribution({
  event,
}: {
  event: Event;
}): Either.Either<Error, Record<string, Distribution[]>> {
  const participantsTotalDueAmount = Object.keys(event.participants).reduce(
    (acc, participantId) =>
      pipe(
        getEventSharesByParticipant({ event, participantId }),
        Either.map((shares) => ({
          [participantId]: getParticipantTotalSharesAmount({ shares }),
        })),
        Either.chain((participantAmount) =>
          pipe(
            acc,
            Either.map((current) => ({
              ...current,
              ...participantAmount,
            }))
          )
        )
      ),
    Either.right<Error, Record<string, number>>({})
  );
  const participantsTotalDepositAmount: Either.Either<
    Error,
    Record<string, number>
  > = pipe(
    Object.keys(event.participants),
    ArrayFP.map((participantId) =>
      pipe(
        getDepositSharesByParticipants({
          event,
          participants: event.participants,
          currentParticipantId: participantId,
        }),
        Either.map((amount) => [participantId, amount] as const)
      )
    ),
    Either.sequenceArray,
    Either.map(Object.fromEntries)
  );

  const participantsTotalPayedAmount = Object.keys(event.participants).reduce(
    (acc, participantId) =>
      pipe(
        getParticipantTotalExpenseAmount({ event, participantId }),
        Either.chain((participantAmount) =>
          pipe(
            acc,
            Either.map((current) => ({
              ...current,
              [participantId]: participantAmount,
            }))
          )
        )
      ),
    Either.right<Error, Record<string, number>>({})
  );

  return pipe(
    sequence({
      participantsTotalDueAmount,
      participantsTotalPayedAmount,
      participantsTotalDepositAmount,
    }),
    Either.map(
      ({
        participantsTotalDueAmount,
        participantsTotalPayedAmount,
        participantsTotalDepositAmount,
      }) => {
        const mergedPayedAndDepositAmounts = Object.keys(
          event.participants
        ).reduce(
          (acc, participantId) => ({
            ...acc,
            [participantId]:
              (participantsTotalPayedAmount[participantId] || 0) +
              participantsTotalDepositAmount[participantId],
          }),
          {} as Record<string, number>
        );

        const remainingDue = Object.keys(event.participants).reduce(
          (acc, participantId) => ({
            ...acc,
            [participantId]:
              participantsTotalDueAmount[participantId] -
              mergedPayedAndDepositAmounts[participantId],
          }),
          {} as Record<string, number>
        );

        const { owingParticipants, owedParticipants } = Object.keys(
          remainingDue
        )
          .sort((a, b) => remainingDue[b] - remainingDue[a])
          .reduce(
            (acc, participantId) => {
              const amount = remainingDue[participantId];

              if (amount < 0) {
                acc.owedParticipants.push({
                  participantId,
                  amount: Math.abs(amount),
                });
              } else if (amount > 0) {
                acc.owingParticipants.push({
                  participantId,
                  amount: Math.abs(amount),
                });
              }
              return acc;
            },
            {
              owingParticipants: [] as {
                participantId: string;
                amount: number;
              }[],
              owedParticipants: [] as {
                participantId: string;
                amount: number;
              }[],
            }
          );

        return owedParticipants.reduce((acc, owedParticipant) => {
          let owedAmount = owedParticipant.amount;
          if (!acc[owedParticipant.participantId]) {
            acc[owedParticipant.participantId] = [];
          }

          owingParticipants.forEach((owingParticipant) => {
            if (!acc[owingParticipant.participantId]) {
              acc[owingParticipant.participantId] = [];
            }

            if (owedAmount <= 0 || owingParticipant.amount <= 0) {
              return;
            }

            const amountToTransfer = Math.min(
              owedAmount,
              owingParticipant.amount
            );
            acc[owedParticipant.participantId].push({
              type: "receive",
              amount: amountToTransfer,
              participant: owingParticipant.participantId,
            });
            acc[owingParticipant.participantId].push({
              type: "give",
              amount: amountToTransfer,
              participant: owedParticipant.participantId,
            });
            owedAmount -= amountToTransfer;
            owingParticipant.amount -= amountToTransfer;
          });

          return acc;
        }, {} as Record<string, Distribution[]>);
      }
    )
  );
}
