import { ReactNode } from "react";

import { Spacing, toCssValue, SPACING } from "../../../entities/spacing";

const JUSTIFY = {
  CENTER: "center",
  START: "start",
  END: "end",
  SPACE_BETWEEN: "space-between",
  SPACE_AROUND: "space-around",
  SPACE_EVENLY: "space-around",
  STRETCH: "stretch",
} as const;
const ALIGN = {
  CENTER: "center",
  START: "start",
  END: "end",
  BASELINE: "baseline",
  STRETCH: "stretch",
} as const;

type Props = {
  children: ReactNode[];
  justify?: keyof typeof JUSTIFY;
  align?: keyof typeof ALIGN;
  spacing?: Spacing;
  grow?: boolean;
  margin?: Spacing;
};
export function Columns({
  children,
  justify = "START",
  align = "CENTER",
  spacing,
  grow,
  margin,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: JUSTIFY[justify],
        alignItems: ALIGN[align],
        width: "100%",
        flexDirection: "row",
        gap: spacing ? `calc(${SPACING[spacing]})` : undefined,
        flexGrow: grow ? 1 : 0,
        margin: margin ? `${toCssValue(margin)}` : undefined,
      }}
    >
      {children}
    </div>
  );
}
