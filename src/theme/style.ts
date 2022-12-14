import { isObject } from './../infrastructure/object';
import * as Record from 'fp-ts/Record';
import { DEFAULT } from "./themes/default/default";

type ToCssVar<T extends {}, U extends string, V extends string> = 
    {} extends T
    ? {}
    : {
        [key in keyof T]: T[key] extends {}
          ? ToCssVar<T[key], U, `${V}${U}${key extends string ? key : ''}`>
          : `--var(${'' extends V ? '' : `${V}${U}`}${key extends string ? key : ''})`
      };

const toCssVar = <T extends {}, U extends string, V extends string>(obj: T, separator: U, root: V): ToCssVar<T, U, V> => 
  Record.mapWithIndex(
    (key, value) => isObject(value)
      ? toCssVar(value, separator, `${root}${separator}${key}`)
      : `var(--${root !== '' ? `${root}${separator}` : ''}${key})`
  )(obj) as ToCssVar<T, U, V>;

export const VAR = toCssVar(DEFAULT, '-', '');
