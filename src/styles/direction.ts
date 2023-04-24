import { AtLeastOne } from "../../@types/atLeastOne";

export const BASE_DIRECTION = {
  HORIZONTAL: "HORIZONTAL",
  VERTICAL: "VERTICAL",
} as const;

export type BaseDirection = keyof typeof BASE_DIRECTION;

export const DIRECTION = {
  ...BASE_DIRECTION,
  BOTH: "BOTH",
} as const;

export type Direction = keyof typeof DIRECTION;

export type AxisDirectionType<A> = { x: A; y: A };
export type AllDirectionType<A> = { top: A; left: A; right: A; bottom: A };
export type DirectionalType<A> =
  | A
  | AtLeastOne<AxisDirectionType<A>>
  | AtLeastOne<AllDirectionType<A>>;

export const toAllDirectionType = <A>(
  value: DirectionalType<A>,
  is: (a: DirectionalType<A>) => a is A,
  defaultValue: A
): AllDirectionType<A> => {
  if (is(value)) {
    return {
      top: value,
      bottom: value,
      left: value,
      right: value,
    };
  } else if ("x" in value || "y" in value) {
    return {
      top: value.x ?? defaultValue,
      bottom: value.x ?? defaultValue,
      left: value.y ?? defaultValue,
      right: value.y ?? defaultValue,
    };
  }
  return {
    top: value.top ?? defaultValue,
    bottom: value.bottom ?? defaultValue,
    left: value.left ?? defaultValue,
    right: value.right ?? defaultValue,
  };
};

export const toDirection = <A>(value: AllDirectionType<A>): Direction => {
  const isHorizontal = "left" in value || "right" in value;
  const isVertical = "top" in value || "bottom" in value;

  if (isHorizontal && isVertical) {
    return "BOTH";
  }
  if (isHorizontal) {
    return "HORIZONTAL";
  }
  return "VERTICAL";
};
