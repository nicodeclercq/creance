export const createArray = <T>(size: number, defaultValue: T) =>
  new Array(size).fill(defaultValue);

export const includes =
  <T, U extends T>(key: U) =>
  (arr: T[] | readonly T[]) =>
    arr.includes(key);
