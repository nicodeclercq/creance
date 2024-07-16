export const addDays = (nb: number, date: Date = new Date()) => {
  const result = new Date(date.valueOf())
  result.setDate(date.getDate() + nb);
  return result;
};

export const sort = (a: Date, b: Date) => a < b
  ? -1
  : a > b
  ? 1
  : 0;

export const isBefore = (a: Date) => (b: Date) => b.getTime() < a.getTime();