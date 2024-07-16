export type Func<Arguments extends unknown[], Result> = (
  ...args: Arguments
) => Result;

export const invertArgs =
  <A, B, C>(f: Func<[A], Func<[B], C>>) =>
  (b: B) =>
  (a: A) =>
    f(a)(b);

export function pipe<A, B, C, D, E, F, G>(
  a: A,
  fn1: Func<[A], B>,
  fn2: Func<[B], C>,
  fn3: Func<[C], D>,
  fn4: Func<[D], E>,
  fn5: Func<[E], F>,
  fn6: Func<[F], G>
): G;
export function pipe<A, B, C, D, E, F>(
  a: A,
  fn1: Func<[A], B>,
  fn2: Func<[B], C>,
  fn3: Func<[C], D>,
  fn4: Func<[D], E>,
  fn5: Func<[E], F>
): F;
export function pipe<A, B, C, D, E>(
  a: A,
  fn1: Func<[A], B>,
  fn2: Func<[B], C>,
  fn3: Func<[C], D>,
  fn4: Func<[D], E>
): E;
export function pipe<A, B, C, D>(
  a: A,
  fn1: Func<[A], B>,
  fn2: Func<[B], C>,
  fn3: Func<[C], D>
): D;
export function pipe<A, B, C>(a: A, fn1: Func<[A], B>, fn2: Func<[B], C>): C;
export function pipe<A, B, C>(a: A, fn1: Func<[A], B>): B;
export function pipe<A>(init: A, ...fns: Function[]) {
  return fns.reduce((acc, fn) => fn(acc), init);
}
