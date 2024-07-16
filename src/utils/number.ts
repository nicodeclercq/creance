export const random = ({
  max = 100,
  min = 0,
}: {
  max?: number;
  min?: number;
}) => Math.round(Math.random() * (max - min) + min);

export const moduloRange =
  ({ max = 100, min = 0 }: { max?: number; min?: number }) =>
  (value: number) =>
    (value % (max - min)) + min;

export const isBetween =
  ({ max = 100, min = 0 }: { max?: number; min?: number }) =>
  (value: number) =>
    value < max && value >= min;

export const sort = (a: number, b: number) => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

export const to2Decimals = (value: number) => {
  const t = Math.round(value * 100) / 100;
  const [val, float] = `${t}`.split(".");
  return `${val}.${(float ?? "").padEnd(2, "0")}`;
};

export const calculateExpression = (expression: string) =>
  // eslint-disable-next-line no-eval
  eval(expression.replace(/[^-()\d/*+.]/g, ""));
