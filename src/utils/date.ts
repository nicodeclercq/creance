export const addDays = (nb: number, date: Date = new Date()) => {
  const result = new Date(date.valueOf());
  result.setDate(date.getDate() + nb);
  return result;
};

export const sort = (a: Date, b: Date) => (a < b ? -1 : a > b ? 1 : 0);

export const isBefore = (a: Date) => (b: Date) => b.getTime() < a.getTime();
export const isAfter = (a: Date) => (b: Date) => b.getTime() > a.getTime();
export const isBetween = (start: Date, end: Date) => (c: Date) =>
  isBefore(start)(c) && isAfter(end)(c);
export const isInInterval =
  (a: { start: Date; end: Date }) => (b: { start: Date; end: Date }) => {
    console.log("isInInterval", a, b);
    return isBefore(a.start)(b.start) && isAfter(a.end)(b.end);
  };
