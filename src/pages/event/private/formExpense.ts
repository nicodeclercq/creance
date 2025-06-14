import * as Either from "fp-ts/Either";

import {
  DefaultShare,
  Expense,
  FixedShare,
  PercentageShare,
} from "../../../models/Expense";

import { UseFormSetError } from "react-hook-form";
import { User } from "../../../models/User";
import { calculationAsNumber } from "../../../helpers/Number";
import { i18n } from "i18next";
import { pipe } from "fp-ts/function";

export type FormExpense = Omit<Expense, "amount" | "share" | "date"> & {
  amount: string;
  date: Date;
  share: {
    type: "default" | "percentage" | "fixed";
    percentageUser: Record<string, string>;
    fixedUser: Record<string, string>;
  };
};
export const fromExpense = (
  expense: Expense,
  users: Record<string, User>
): FormExpense => {
  const share = {
    type: expense.share.type,
    percentageUser: Object.keys(users).reduce(
      (acc, user) => ({
        ...acc,
        [user]:
          expense.share.type === "percentage"
            ? expense.share.distribution[user]
            : "0",
      }),
      {} as Record<string, string>
    ),
    fixedUser: Object.keys(users).reduce(
      (acc, user) => ({
        ...acc,
        [user]:
          expense.share.type === "fixed"
            ? expense.share.distribution[user]
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
      const fixedDistribution = Object.entries(data.share.fixedUser).reduce(
        (
          acc: Either.Either<Error, FixedShare["distribution"]>,
          [userId, value]
        ) => {
          const calculation = calculationAsNumber(value);
          if (Either.isLeft(calculation)) {
            return Either.left(new Error("Invalid fixed share"));
          }

          return pipe(
            acc,
            Either.map((acc) => ({
              ...acc,
              [userId]: value,
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
        data.share.percentageUser
      ).reduce(
        (
          acc: Either.Either<Error, PercentageShare["distribution"]>,
          [userId, value]
        ) => {
          const calculation = calculationAsNumber(value);
          if (Either.isLeft(calculation)) {
            console.error("Invalid percentage share", { value, calculation });
            return Either.left(new Error("Invalid percentage share"));
          }

          return pipe(
            acc,
            Either.map((acc) => ({
              ...acc,
              [userId]: value,
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
