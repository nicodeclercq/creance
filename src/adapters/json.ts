import * as Either from "fp-ts/Either";

import type { State } from "../store/state";
import type { ZodError } from "zod";
import { validateOrDefaultsToState } from "../store/state";

export const toState = (data: unknown): Either.Either<ZodError, State> => {
  const parsed = validateOrDefaultsToState(data);
  return Either.right(parsed);
};

export const fromState = (state: State): string => {
  return JSON.stringify(state);
};
