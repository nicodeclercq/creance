export type Sum = {
  value: number;
  concat: (a: Sum) => Sum;
}

export const concat = (a: Sum, b: Sum) => a.concat(b);

export const empty = () => of(0);

export const of = (value: number) => ({
  value: value * 1,
  concat: (b: Sum) => of(value * 1 + b.value)
});