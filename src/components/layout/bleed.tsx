import React, { useMemo } from "react";
import { css } from "@emotion/css";
import { VAR, Var } from "../../theme/style";
import {
  DirectionalType,
  toAllDirectionType,
  toDirection,
} from "../../styles/direction";

type Space = keyof Var["SIZE"]["BASE"] | "NONE";
const isSpace = (a: unknown): a is Space =>
  typeof a === "string" && (a in VAR.SIZE.BASE || a === "NONE");
type DirectionalSpace = DirectionalType<Space>;

const spaceToValue = (space: Space) =>
  space === "NONE" ? undefined : VAR.SIZE.BASE[space];

type Props = {
  space: DirectionalSpace;
  children: React.ReactNode;
};

export function Bleed({ space, children }: Props) {
  const style = useMemo(() => {
    const directionValues = toAllDirectionType<Space>(space, isSpace, "NONE");
    const direction = toDirection(directionValues);

    return css({
      marginTop: `calc(-1 * ${spaceToValue(directionValues.top)})`,
      marginBottom: `calc(-1 * ${spaceToValue(directionValues.bottom)})`,
      marginLeft: `calc(-1 * ${spaceToValue(directionValues.left)})`,
      marginRight: `calc(-1 * ${spaceToValue(directionValues.right)})`,
      width:
        direction === "VERTICAL"
          ? undefined
          : `calc(100% + ${spaceToValue(directionValues.left) ?? 0} + ${
              spaceToValue(directionValues.right) ?? 0
            })`,
      height:
        direction === "HORIZONTAL"
          ? undefined
          : `calc(100% + ${spaceToValue(directionValues.top) ?? 0} + ${
              spaceToValue(directionValues.bottom) ?? 0
            })`,
    });
  }, [space]);

  return <div className={style}>{children}</div>;
}
