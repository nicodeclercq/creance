export type ValueOf<T> = T[keyof T];
type Func<A extends unknown[], B> = (...args: A) => B;

export const entries = <T extends Record<string | number | symbol, unknown>>(
  o: T
) => Object.entries(o) as [keyof T, ValueOf<T>][];

export const mapObject =
  <T, U>(fn: Func<[T, string, { [key: string]: T }], U>) =>
  (o: { [key: string]: T }): { [key in keyof typeof o]: U } =>
    Object.entries(o)
      .map(([key, value]) => [key, fn(value, key, o)] as [string, U])
      .reduce(
        (acc, [key, value]: [string, U]) => ({ ...acc, [key]: value }),
        {} as { [key in keyof typeof o]: U }
      );

export const filterObject = <T extends Record<string, unknown>>(
  obj: T,
  fn: Func<[T[keyof T], string, T], boolean>
) =>
  Object.entries(obj)
    .filter(([key, value]) => fn(value as T[keyof T], key, obj))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

export type Path<T, Prefix extends string = ""> = T extends object
  ? {
      [K in (string | number) & keyof T]: `${Prefix}${
        | `${K}`
        | (`${K}` extends `${number}` ? `[${K}]` : never)}${
        | ""
        | Path<T[K], ".">}`;
    }[(string | number) & keyof T]
  : never;

export type ValueFromPath<P, O> = P extends `${infer Head}.${infer Tail}`
  ? Head extends keyof O
    ? ValueFromPath<Tail, O[Head]>
    : never
  : P extends keyof O
  ? O[P]
  : never;

export const getValueFromPath =
  <P extends Path<O>, O>(path: P) =>
  (object: O): ValueFromPath<P, O> => {
    if (!path) {
      return object as ValueFromPath<P, O>;
    }
    if (typeof path !== "string") {
      throw new Error("Path must be a string");
    }

    return path.split(".").reduce((acc, key) => {
      return acc?.[key as keyof typeof acc];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, object as any) as ValueFromPath<P, O>;
  };

export function setValueAtPath<P extends Path<State>, State>(
  path: P,
  map: (oldValue: ValueFromPath<P, State>) => ValueFromPath<P, State>,
  state: State = {} as State
): State {
  // automatically add updatedAt date to the value
  const mapWithUpdatedAtDate = (
    oldValue: ValueFromPath<P, State>
  ): ValueFromPath<P, State> => {
    const newValue = map(oldValue);
    if (
      typeof newValue === "object" &&
      newValue !== null &&
      "updatedAt" in newValue
    ) {
      return {
        ...newValue,
        updatedAt: new Date(),
      };
    }
    return newValue;
  };

  if (path.length === 0) {
    return mapWithUpdatedAtDate(state as ValueFromPath<P, State>) as State;
  }

  const [h, ...t] = path.split(".");
  const head = h as keyof State;
  const tail = t.join(".") as Path<State[keyof State]>;

  const newState = (
    state instanceof Array ? [...state] : { ...state }
  ) as State;
  // @ts-expect-error FIXME
  newState[head] = setValueAtPath(tail, map, newState[head]) as State;
  return newState;
}
