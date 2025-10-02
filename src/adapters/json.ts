import * as Either from "fp-ts/Either";

import { State, stateSchema } from "../store/state";

import type { ZodError } from "zod";

export const toState = (data: unknown): Either.Either<ZodError, State> => {
  const parsed = stateSchema.safeParse(data);
  if (!parsed.success) {
    return Either.left(parsed.error);
  }

  return Either.right(parsed.data);
};

export const fromState = (state: State): string => {
  return JSON.stringify(state);
};
