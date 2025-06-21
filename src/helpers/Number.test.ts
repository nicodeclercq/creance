import * as Either from "fp-ts/Either";

import { calculationAsNumber, isValidCalculation } from "./Number";
import { describe, expect, it } from "vitest";

describe("calculationAsNumber", () => {
  it("should handle accept 0", () => {
    expect(calculationAsNumber("0")).toStrictEqual(Either.right(0));
  });
  it("should handle raw numbers", () => {
    expect(calculationAsNumber("12345")).toStrictEqual(Either.right(1234500));
  });
  it("should handle flloating point numbers", () => {
    expect(calculationAsNumber("123.45")).toStrictEqual(Either.right(12345));
  });
  it("should handle simple calculation", () => {
    expect(calculationAsNumber("12 + 34.56")).toStrictEqual(Either.right(4656));
  });
  it("should handle complex calculation", () => {
    expect(calculationAsNumber("12 * 2  + (1 + 2) * 5")).toStrictEqual(
      Either.right(3900)
    );
  });
});

describe("isValidCalculation", () => {
  it("should return true for valid calculations", () => {
    expect(isValidCalculation("12 + 34.56")).toBe(true);
    expect(isValidCalculation("12 * 2 + (1 + 2) * 5")).toBe(true);
  });

  it("should return false for invalid calculations", () => {
    expect(isValidCalculation("12 + abc")).toBe(false);
    expect(isValidCalculation("12 / 0")).toBe(false);
    expect(isValidCalculation("++12")).toBe(false);
  });
});
