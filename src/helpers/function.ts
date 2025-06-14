export type Fn<A extends unknown[], B> = (...a: A) => B;

export type LazyFn<A> = () => A;

export function run<A>(fn: () => A) {
  return fn();
}
