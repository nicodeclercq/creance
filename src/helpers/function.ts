export type Fn<A extends unknown[], B> = (...a: A) => B;

export type LazyFn<A> = () => A;

export function run<A>(fn: () => A) {
  return fn();
}

type MaybePromise<A> = A | Promise<A>;

export const runSequentially = <A, T extends Fn<[A], MaybePromise<A>>>(
  initState: A,
  fns: T[]
) =>
  fns.reduce(
    (acc, cur) => acc.then(cur),
    Promise.resolve(initState) as Promise<A>
  );
