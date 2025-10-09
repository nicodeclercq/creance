import * as Either from "fp-ts/Either";

import { Logger } from "../service/Logger";
import { pipe } from "fp-ts/function";

const ALLOWER_CHARS = "0-9.,+*()-/";

export function centToDecimal(calculation: string | number) {
  const asString = `${calculation}`.split(".")[0];

  const part1 = asString.substring(0, asString.length - 2);
  const part2 = asString.substring(asString.length - 2, asString.length);

  return `${part1}.${part2}`;
}

export function calculationAsNumber(
  value: string
): Either.Either<Error, number> {
  try {
    return pipe(
      value
        .trim()
        .replace(new RegExp(`[^${ALLOWER_CHARS}]`, "g"), "") // Remove unallowed characters
        .replace(/^0+/g, "") // Remove leading zeros
        .replace(/ /g, ""), // Remove spaces
      (a) => (a === "" ? "0" : a), // Replace empty string with 0
      (a) => eval(a), // Evaluate the expression
      (a) =>
        isNaN(a) || !isFinite(a)
          ? Either.left(new Error(`Invalid calculation "${value}" "${a}"`))
          : Either.right(a * 100)
    );
  } catch (error) {
    Logger.error("Error in calculation:")({ value, error });
    return Either.left(new Error(`Invalid calculation "${value}" "${error}"`));
  }
}

export function asNumber(value: string): number {
  return pipe(
    value,
    calculationAsNumber,
    Either.getOrElse(() => {
      Logger.warn("Invalid calculation, returning NaN")(value);
      return NaN;
    })
  );
}

export function isValidCalculation(value: string): boolean {
  return Either.isRight(calculationAsNumber(value));
}
