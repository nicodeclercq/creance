import { Func } from "./functions";
import { ValueOf } from "src/ValueOf";

export const entries = <T extends {}>(o: T): [keyof T, ValueOf<T>][] =>
  // @ts-ignore
  Object.entries(o);

export const mapObject =
  <T, U>(fn: Func<[T, string, { [key: string]: T }], U>) =>
  (o: { [key: string]: T }): { [key in keyof typeof o]: U } =>
    Object.entries(o)
      .map(([key, value]: [string, T]) => [key, fn(value, key, o)])
      .reduce(
        (acc, [key, value]: [string, U]) => ({ ...acc, [key]: value }),
        {}
      );
