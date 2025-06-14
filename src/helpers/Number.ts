import * as Either from "fp-ts/Either";

import { pipe } from "fp-ts/function";

function to2Chars(value: string): string {
  switch (value.length) {
    case 0:
      return "00";
    case 1:
      return `${value}0`;
    case 2:
      return value;
    default:
      return value.slice(0, 2);
  }
}

export function centToDecimal(calculation: string | number) {
  const asString = `${calculation}`.split(".")[0];

  const part1 = asString.substring(0, asString.length - 2);
  const part2 = asString.substring(asString.length - 2, asString.length);

  return `${part1}.${part2}`;
}

function decimalToCent(calculation: string) {
  if (calculation === "" || calculation === "0") {
    return "0";
  }

  const elements = calculation.split("").reduce(
    (acc, char) => {
      if (/[0-9]/.test(char)) {
        if (acc.isDecimal) {
          acc.decimal += char;
        } else {
          acc.int += char;
        }
      } else if (char === ".") {
        acc.isDecimal = true;
      } else {
        const decimal = to2Chars(acc.decimal);
        acc.parts = [...acc.parts, `${acc.int}${decimal}`];
        acc.int = "";
        acc.decimal = "";
        acc.isDecimal = false;
      }

      return acc;
    },
    { parts: [] as string[], isDecimal: false, int: "", decimal: "" }
  );

  const result = `${elements.parts.join("")} ${elements.int}${to2Chars(
    elements.decimal
  )}`;
  return result;
}

export function calculationAsNumber(
  value: string
): Either.Either<Error, number> {
  try {
    const withoutUnknownChars = value.replace(/[^0-9.,+*-/]/g, "");
    const withoutTrailingZeros = withoutUnknownChars.replace(/^0+/g, "");
    const cents = decimalToCent(withoutTrailingZeros);
    const result = eval(cents);
    if (isNaN(result)) {
      console.error("Invalid calculation:", { value, result, cents });
      Either.left(new Error("Invalid calculation"));
    }
    return Either.right(result);
  } catch (error) {
    console.error("Error in calculation:", { value, error });
    return Either.left(new Error("Invalid calculation"));
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
