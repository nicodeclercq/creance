import { Func } from "./functions";
import { ValueOf } from "../ValueOf";

export const entries = <T extends Record<string | number | symbol, unknown>>(
  o: T
) => Object.entries(o) as [keyof T, ValueOf<T>][];

export const mapObject =
  <T, U>(fn: Func<[T, string, { [key: string]: T }], U>) =>
  (o: { [key: string]: T }): { [key in keyof typeof o]: U } =>
    Object.entries(o)
      .map(
        ([key, value]: [string, T]) => [key, fn(value, key, o)] as [string, U]
      )
      .reduce(
        (acc, [key, value]: [string, U]) => ({ ...acc, [key]: value }),
        {}
      );

export const filterObject = <T extends Record<string, unknown>>(
  obj: T,
  fn: Func<[T[keyof T], string, T], boolean>
) =>
  Object.entries(obj)
    .filter(([key, value]) => fn(value as T[keyof T], key, obj))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
