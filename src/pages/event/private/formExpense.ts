import * as Either from "fp-ts/Either";

import type {
  DefaultShare,
  Expense,
  FixedShare,
  PercentageShare,
} from "../../../models/Expense";

import { Logger } from "../../../service/Logger";
import type { Participant } from "../../../models/Participant";
import type { UseFormSetError } from "react-hook-form";
import { calculationAsNumber } from "../../../helpers/Number";
import type { i18n } from "i18next";
import { pipe } from "fp-ts/function";

export type FormExpense = Omit<Expense, "amount" | "share" | "date"> & {
  amount: string;
  date: Date;
  share: {
    type: "default" | "percentage" | "fixed";
    percentageParticipant: Record<string, string>;
    fixedParticipant: Record<string, string>;
  };
};
export const fromExpense = (
  expense: Expense,
  participants: Record<string, Participant>
): FormExpense => {
  const share = {
    type: expense.share.type,
    percentageParticipant: Object.keys(participants).reduce(
      (acc, participant) => ({
        ...acc,
        [participant]:
          expense.share.type === "percentage"
            ? expense.share.distribution[participant]
            : "0",
      }),
      {} as Record<string, string>
    ),
    fixedParticipant: Object.keys(participants).reduce(
      (acc, participant) => ({
        ...acc,
        [participant]:
          expense.share.type === "fixed"
            ? expense.share.distribution[participant]
            : "0",
      }),
      {} as Record<string, string>
    ),
  };

  return {
    ...expense,
    date: new Date(expense.date),
    share,
  };
};

export const toExpense = (
  data: FormExpense,
  setError: UseFormSetError<FormExpense>,
  t: i18n["t"]
): Either.Either<Error, Expense> => {
  const calculation = calculationAsNumber(data.amount);
  if (Either.isLeft(calculation)) {
    setError("amount", {
      type: "manual",
      message: t("page.event.add.form.field.amount.validation.isNumber"),
    });
    return Either.left(new Error("Invalid amount"));
  }

  switch (data.share.type) {
    case "default":
      return Either.right({
        ...data,
        amount: data.amount,
        date: data.date,
        share: { type: "default" } as DefaultShare,
        updatedAt: new Date(),
      });
    case "fixed":
      const fixedDistribution = Object.entries(
        data.share.fixedParticipant
      ).reduce(
        (
          acc: Either.Either<Error, FixedShare["distribution"]>,
          [participantId, value]
        ) => {
          const calculation = calculationAsNumber(value);
          if (Either.isLeft(calculation)) {
            return Either.left(new Error("Invalid fixed share"));
          }

          return pipe(
            acc,
            Either.map((acc) => ({
              ...acc,
              [participantId]: value,
            }))
          );
        },
        Either.right({} as FixedShare["distribution"])
      );

      return pipe(
        fixedDistribution,
        Either.map((distribution) => ({
          ...data,
          share: {
            type: "fixed",
            distribution,
          } as FixedShare,
          updatedAt: new Date(),
        }))
      );
    case "percentage":
      const percentageDistribution = Object.entries(
        data.share.percentageParticipant
      ).reduce(
        (
          acc: Either.Either<Error, PercentageShare["distribution"]>,
          [participantId, value]
        ) => {
          const calculation = calculationAsNumber(value);
          if (Either.isLeft(calculation)) {
            Logger.error("Invalid percentage share")({ value, calculation });
            return Either.left(new Error("Invalid percentage share"));
          }

          return pipe(
            acc,
            Either.map((acc) => ({
              ...acc,
              [participantId]: value,
            }))
          );
        },
        Either.right({} as PercentageShare["distribution"])
      );

      return pipe(
        percentageDistribution,
        Either.map((distribution) => ({
          ...data,
          share: {
            type: "percentage",
            distribution,
          } as PercentageShare,
          updatedAt: new Date(),
        }))
      );
  }
};
