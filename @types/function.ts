export type Fn<A extends unknown[], B> = (...a: A) => B;

export type LazyFn<A> = () => A;
