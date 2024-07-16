import { ReactNode } from "react";
import { Spacing, SPACING } from "../../../entities/spacing";

type Props = {
  children: ReactNode;
  justify?:
    | "CENTER"
    | "START"
    | "END"
    | "SPACE_BETWEEN"
    | "SPACE_AROUND"
    | "SPACE_EVENLY";
  align?: "CENTER" | "START" | "END" | "BASELINE" | "STRETCH";
  wrap?: boolean;
  spacing?: Spacing;
  spacingX?: Spacing;
  spacingY?: Spacing;
};
export function Inline({
  children,
  justify,
  spacing,
  spacingX,
  spacingY,
  align,
  wrap = true,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: wrap ? "wrap" : "nowrap",
        flexDirection: "row",
        gap: `${spacingY ? SPACING[spacingY] : SPACING[spacing ?? "M"]} ${
          spacingX ? SPACING[spacingX] : SPACING[spacing ?? "M"]
        }`,
        alignItems: align,
        justifyContent: justify,
      }}
    >
      {children}
    </div>
  );
}
