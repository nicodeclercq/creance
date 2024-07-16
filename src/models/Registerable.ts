import { Func } from "../utils/functions";
import { uid } from "../uid";

export const REGISTERED = "Registerable.Registered";
export const UNREGISTERED = "Registerable.Unregistered";

export type Registered<T> = T & {
  id: string;
  _tag: typeof REGISTERED;
  date: Date;
};
export type Unregistered<T> = T & {
  _tag: typeof UNREGISTERED;
};

export type Registerable<T> = Registered<T> | Unregistered<T>;

export const isRegistered = <T>(a: Registerable<T>): a is Registered<T> =>
  a._tag === REGISTERED;

export const hasId = <T>(a: T): a is T & { id: string } =>
  a != null && typeof a === "object" && "id" in a && a.id != null;

export const equals = <T>(a: Registered<T>, b: Registered<T>) => a.id === b.id;

export const of = <T>(a: T): Registered<T> => ({
  ...a,
  id: uid(),
  date: new Date(),
  _tag: REGISTERED,
});

export const fold =
  <T, U, V>({
    unregistered,
    registered,
  }: {
    unregistered: Func<[Unregistered<T>], U>;
    registered: Func<[Registered<T>], V>;
  }) =>
  (a: Registerable<T>) =>
    isRegistered(a) ? registered(a) : unregistered(a);

export const unregisted = <T>(entity: T): Unregistered<T> =>
  of(entity) as unknown as Unregistered<T>;

export const register = <T>(entity: Unregistered<T>): Registered<T> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _tag, ...tmp } = entity;

  return of(tmp as unknown as T);
};
