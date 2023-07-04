import { isObject } from "./../infrastructure/object";
import * as Record from "fp-ts/Record";
import { ColorCategoryName, ColorForce, TOKEN } from "./tokens/tokens";

type ToCssVar<T extends {}, U extends string, V extends string> = {} extends T
  ? {}
  : {
      [key in keyof T]: T[key] extends {}
        ? ToCssVar<T[key], U, `${V}${U}${key extends string ? key : ""}`>
        : `--var(${"" extends V ? "" : `${V}${U}`}${key extends string
            ? key
            : ""})`;
    };

const toCssVar = <T extends {}, U extends string, V extends string>(
  obj: T,
  separator: U,
  root: V
): ToCssVar<T, U, V> =>
  Record.mapWithIndex((key, value) =>
    isObject(value)
      ? toCssVar(value, separator, `${root}${separator}${key}`)
      : `var(--${root !== "" ? `${root}${separator}` : ""}${key})`
  )(obj) as ToCssVar<T, U, V>;

export const VAR = toCssVar(TOKEN, "-", "");
export type Var = typeof VAR;

export const font = <
  Type extends keyof Var["FONT"],
  Level extends keyof Var["FONT"][Type]
>(
  type: Type,
  level: Level
) => {
  var font = VAR.FONT[type][level] as any;
  return `
    font: ${font.fontWeight} ${font.fontSize}/${font.lineHeight} ${font.fontFamily};

    ::before {
      content: ${font["::before"].content};
      marginBottom: ${font["::before"].marginBottom};
      display: ${font["::before"].display};
    }

    ::after {
      content: ${font["::before"].content};
      marginTop: ${font["::before"].marginTop};
      display: ${font["::before"].display};
    }
  `;
};

export const radius = (radius: keyof Var["RADIUS"]) =>
  `border-radius: ${VAR.RADIUS[radius]};`;

export const shadow = (shadow: keyof Var["SHADOW"]["OUTSET"]) =>
  `box-shadow: ${VAR.SHADOW["OUTSET"][shadow]};`;
export const colors = <K extends ColorCategoryName>(
  color: K,
  force?: ColorForce<K>
) =>
  // @ts-ignore
  `background: ${VAR.COLOR[color]["SURFACE"][force ?? "WEAK"]};
  color: ${
    // @ts-ignore
    VAR.COLOR[color]["MAIN"][force ?? "STRONGER"]
  }`;

export const padding = (size: keyof Var["SIZE"]["PADDING"]["HORIZONTAL"]) =>
  `padding: ${VAR.SIZE.PADDING.VERTICAL[size]} ${VAR.SIZE.PADDING.HORIZONTAL[size]};`;
