import { Border, BORDER, BORDER_DEFINITION } from "../entities/border";

export function Line({ type = BORDER.DEFAULT }: { type?: Border }) {
  return (
    <hr
      style={{
        width: "100%",
        borderInline: "none",
        borderBlockEnd: "none",
        borderBlockStart: BORDER_DEFINITION[type],
        margin: "0",
      }}
    />
  );
}
