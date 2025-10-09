import { MEDIA_QUERY_BREAKPOINTS, type Styles, computeStyles } from "./styles";
import { describe, expect, it } from "vitest";

describe("computeStyles", () => {
  it.each([
    {
      styles: {
        display: "flex",
      } as Styles,
      expected: "display: flex;",
    },
    {
      styles: {
        display: "grid",
        alignItems: "center",
        justifyContent: "space-between",
      } as Styles,
      expected:
        "display: grid; align-items: center; justify-content: space-between;",
    },
    {
      styles: {
        display: "grid",
        gridTemplateColumns: {
          default: 2,
          sm: ["1fr", "1fr"],
          md: ["1fr", "1fr", "1fr"],
        },
      } as Styles,
      expected: `display: grid; grid-template-columns: repeat(2, '1fr'); @media (min-width: ${MEDIA_QUERY_BREAKPOINTS.sm}px) { grid-template-columns: 1fr 1fr; } @media (min-width: ${MEDIA_QUERY_BREAKPOINTS.md}px) { grid-template-columns: 1fr 1fr 1fr; }`,
    },
    {
      styles: {
        border: "default",
        customCSSProperties: {
          "--test-1": "10px",
          "--test-2": {
            default: "5rem",
            sm: "10rem",
            md: "15rem",
            lg: "20rem",
          },
        },
      } as Styles,
      expected: `--test-1: 10px; --test-2: 5rem; @media (min-width: ${MEDIA_QUERY_BREAKPOINTS.sm}px) { --test-2: 10rem; } @media (min-width: ${MEDIA_QUERY_BREAKPOINTS.md}px) { --test-2: 15rem; } @media (min-width: ${MEDIA_QUERY_BREAKPOINTS.lg}px) { --test-2: 20rem; } border: var(--ui-border-default);`,
    },
  ])("should return the correct styles", ({ styles, expected }) => {
    const computedStyles = computeStyles(styles);
    expect(computedStyles).toBe(expected);
  });
});
