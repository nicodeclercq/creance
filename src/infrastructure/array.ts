export const createArray = <T>(size: number, defaultValue: T) => new Array(size)
  .fill(defaultValue);