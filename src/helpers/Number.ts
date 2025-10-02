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
    const trimmedValue = value.trim();
    const withoutUnknownChars = trimmedValue.replace(
      new RegExp(`[^${ALLOWER_CHARS}]`, "g"),
      ""
    );
    const withoutTrailingZeros = withoutUnknownChars.replace(/^0+/g, "");
    const withoutSpaces = withoutTrailingZeros.replace(/ /g, "");
    const withEmptyStringHandling = withoutSpaces === "" ? "0" : withoutSpaces;
    const result = eval(withEmptyStringHandling);
    if (isNaN(result) || !isFinite(result)) {
      Logger.error("Invalid calculation:")({ value, result });
      return Either.left(
        new Error(`Invalid calculation "${value}" "${result}"`)
      );
    }
    return Either.right(result * 100);
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
