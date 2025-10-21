import * as Either from "fp-ts/Either";

import type { State } from "../store/state";
import type { ZodError } from "zod";
import { stateSchema } from "../store/state";

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
