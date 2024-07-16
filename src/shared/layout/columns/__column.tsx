import { ReactNode } from "react";

const ALIGN = {
  CENTER: "center",
  START: "start",
  END: "end",
  BASELINE: "baseline",
  STRETCH: "stretch",
} as const;

export type Props = {
  children: ReactNode;
  align?: keyof typeof ALIGN;
  grow?: boolean;
  shrink?: boolean;
  contentFit?: boolean;
  disableWrap?: boolean;
};
export function __Column({
  children,
  align,
  grow = false,
  shrink = true,
  contentFit = false,
  disableWrap = false,
}: Props) {
  return (
    <div
      className={contentFit ? "contentFit" : undefined}
      style={{
        flexGrow: grow ? 1 : 0,
        flexShrink: shrink ? 1 : 0,
        display: "inline-flex",
        alignItems: "center",
        alignSelf: align ? ALIGN[align] : undefined,
        flexWrap: disableWrap ? "nowrap" : "wrap",
      }}
    >
      {children}
    </div>
  );
}
