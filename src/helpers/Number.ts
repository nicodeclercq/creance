import * as Either from "fp-ts/Either";

import { pipe } from "fp-ts/function";

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
    const withoutUnknownChars = value.replace(/[^0-9.,+*()-/]/g, "");
    const withoutTrailingZeros = withoutUnknownChars.replace(/^0+/g, "");
    const withoutSpaces = withoutTrailingZeros.replace(/ /g, "");
    const result = eval(withoutSpaces);
    if (isNaN(result)) {
      console.error("Invalid calculation:", { value, result });
      Either.left(new Error(`Invalid calculation "${value}" "${result}"`));
    }
    return Either.right(result * 100);
  } catch (error) {
    console.error("Error in calculation:", { value, error });
    return Either.left(new Error(`Invalid calculation "${value}" "${error}"`));
  }
}

export function asNumber(value: string): number {
  return pipe(
    value,
    calculationAsNumber,
    Either.getOrElse(() => {
      console.warn("Invalid calculation, returning NaN", value);
      return NaN;
    })
  );
}

export function isValidCalculation(value: string): boolean {
  return (
    /^[0-9.,+*-/ ]+$/g.test(value) && Either.isRight(calculationAsNumber(value))
  );
}
