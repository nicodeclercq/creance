import * as E from "fp-ts/Either";

import { ReactNode } from "react";
import { pipe } from "fp-ts/function";
import { sequenceS } from "fp-ts/lib/Apply";

export const sequence = sequenceS(E.Apply);

type EitherProps<E, R> = {
  data: E.Either<E, R>;
  onLeft: (error: E) => ReactNode;
  onRight: (result: R) => ReactNode;
};

export function Either<E, R>({ data, onLeft, onRight }: EitherProps<E, R>) {
  return pipe(data, E.fold(onLeft, onRight));
}
