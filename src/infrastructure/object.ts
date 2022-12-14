import { pipe, constTrue } from 'fp-ts/function';
import * as Record from 'fp-ts/Record';

type Head<T> = T extends [infer I, ...infer _Rest] ? I : never
type Tail<T> = T extends [infer _I, ...infer Rest] ? Rest : never

export const isDefined = <A>(o: A | null | undefined): o is A => o != null;

export const isArray = (item: any): item is unknown[] => item instanceof Array;

export const isObject = (item: any): item is {} => {
  return (item === Object(item) && !Array.isArray(item));
};

type Zip_DeepMergeTwoTypes<T, U> = T extends []
  ? U
  : U extends []
  ? T
  : [
      DeepMergeTwoTypes<Head<T>, Head<U>>,
      ...Zip_DeepMergeTwoTypes<Tail<T>, Tail<U>>
  ]

type GetObjDifferentKeys<
  T,
  U,
  T0 = Omit<T, keyof U> & Omit<U, keyof T>,
  T1 = { [K in keyof T0]: T0[K] }
 > = T1

type GetObjSameKeys<T, U> = Omit<T | U, keyof GetObjDifferentKeys<T, U>>

type MergeTwoObjects<
  T,
  U, 
  T0 = Partial<GetObjDifferentKeys<T, U>>
  & {[K in keyof GetObjSameKeys<T, U>]: DeepMergeTwoTypes<T[K], U[K]>},
  T1 = { [K in keyof T0]: T0[K] }
> = T1

type DeepMergeTwoTypes<T, U> =
  [T, U] extends [any[], any[]]
    ? Zip_DeepMergeTwoTypes<T, U>
    : [T, U] extends [{ [key: string]: unknown}, { [key: string]: unknown } ]
      ? MergeTwoObjects<T, U>
      : T | U

export const deepMerge = <O1 extends {}, O2 extends {}>(obj1: O1, obj2: O2): DeepMergeTwoTypes<O1, O2> => {
  const map = new Map();
  map.set(isArray, <T, U>(o1: T[], o2: U[]) => [...new Set([...o1, ...o2])]);
  map.set(isObject, deepMerge);
  map.set(constTrue, <T, U>(o1: T, o2: U)=> o2);

  const mergeValue = <T, U>(o1: T, o2: U) => {
    let isSolved = false;
    let result;
    Array.from(map.entries()).map(([predicate, handler]) => {
      if(predicate(o1) && predicate(o2)){
        result = handler(o1, o2);
        isSolved = true;
      }
    });
    return result;
  }

  return pipe(
    obj1,
    Record.mapWithIndex((key, value) => Record.has(key, obj2)
      ? mergeValue(obj1[key], obj2[key])
      : value,
    ),
    a => a as DeepMergeTwoTypes<O1, O2>,
  );
};

export const get = <A extends keyof B, B extends {}>(key: A) => (obj: B) => obj[key];
export const getOptional = <A extends string, B extends {} | undefined, C>(key: A, orElse?: () => C) => (obj: B) => {
  const o = obj || {};
  return Record.has(key, o) ? o[key] : isDefined(orElse) ? orElse() : undefined;
}

export type ValueOf<T extends Record< string | number | symbol,unknown>> =  T extends Record<string | number | symbol, infer R> ? R : never;
export type KeyOf<T extends Record< string | number | symbol,unknown>> =  keyof T;
