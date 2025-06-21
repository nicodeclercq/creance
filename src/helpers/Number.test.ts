import * as Either from "fp-ts/Either";

import { describe, expect, it } from "vitest";

import { calculationAsNumber } from "./Number";

describe("calculationAsNumber", () => {
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
