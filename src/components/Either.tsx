import { ReactNode } from "react";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";

export function Either<Er, D>({
  data,
  onLeft,
  onRight,
}: {
  data: E.Either<Er, D>;
  onLeft: (e: Er) => ReactNode;
  onRight: (data: D) => ReactNode;
}) {
  return <>{pipe(data, E.fold(onLeft, onRight))}</>;
}
