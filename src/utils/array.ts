import { Fn } from "../helpers/function";

type Direction = "asc" | "desc";

const directionModifier = {
  asc: 1,
  desc: -1,
};

const sortNullable = <A>(
  a: A | undefined,
  b: A | undefined,
  direction: Direction,
  sortFn: (a: A, b: A) => number
) => {
  if (a == null && b == null) {
    return 0;
  }
  if (a == null) {
    return directionModifier[direction];
  }
  if (b == null) {
    return directionModifier[direction] * -1;
  }

  return sortFn(a, b) * directionModifier[direction];
};

export const sortStrings = (a: string, b: string) => a.localeCompare(b);
export const sortBooleans = (a: boolean, b: boolean) => {
  if (a === b) {
    return 0;
  }
  if (a) {
    return 1;
  }
  if (b) {
    return -1;
  }
  return 0;
};
export const sortNumbers = (a: number, b: number) => a - b;
export const sortDates = (a: Date, b: Date) => a.getTime() - b.getTime();

export const sortByKey =
  <Obj extends Record<string, unknown>, Key extends keyof Obj>(
    key: Key,
    direction: Direction,
    sortFn: (a: Obj[Key], b: Obj[Key]) => number
  ) =>
  (a: Obj, b: Obj) => {
    const valueA = a[key];
    const valueB = b[key];

    return sortNullable(valueA, valueB, direction, sortFn);
  };

export const sortByPriority =
  <Obj extends Record<string, unknown>>(sorters: Fn<[Obj, Obj], number>[]) =>
  (a: Obj, b: Obj) =>
    sorters.reduce((acc, sorter) => (acc === 0 ? sorter(a, b) : acc), 0);
