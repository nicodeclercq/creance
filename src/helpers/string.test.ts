import { describe, expect, it } from "vitest";

import { camelCaseToKebab } from "./string";

describe("camelCaseToKebab", () => {
  it("should convert camelCase to kebab-case", () => {
    expect(camelCaseToKebab("camelCaseString")).toBe("camel-case-string");
    expect(camelCaseToKebab("camelCaseStringWithNumbers123")).toBe(
      "camel-case-string-with-numbers123"
    );
    expect(
      camelCaseToKebab("camelCaseStringWithNumbers123AndSpecialChars!@#$%^&*()")
    ).toBe("camel-case-string-with-numbers123-and-special-chars!@#$%^&*()");
  });
});
