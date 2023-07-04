export const isFunction = (a: unknown): a is Function =>
  typeof a === "function";

export const getValue = <A>(a: A | (() => A)) => (isFunction(a) ? a() : a);

export const delay = (time: number = 0) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });
