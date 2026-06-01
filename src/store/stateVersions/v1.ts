import * as z from "zod";

import { sanitizeMergeableCollection } from "../../models/mergeable";
import type { User } from "../../models/User";
import {
  DEFAULT_STATE_V0,
  stateSchemaV0,
  validateOrDefaultsToStateV0,
} from "./v0";

const preprocessState = (state: unknown): unknown =>
  typeof state === "object" && state !== null && "users" in state
    ? {
        ...state,
        users: sanitizeMergeableCollection<User>(
          (state as { users: unknown }).users,
        ),
      }
    : state;

export const stateSchemaV1 = z.strictObject({
  ...stateSchemaV0.shape,
  version: z.literal(1),
});

export type StateV1 = z.infer<typeof stateSchemaV1>;

export const DEFAULT_STATE_V1: StateV1 = {
  ...DEFAULT_STATE_V0,
  version: 1,
};

export const validateStateV1 = (state: unknown): StateV1 => {
  const parsed = stateSchemaV1.safeParse(state);
  if (parsed.success) {
    return parsed.data;
  }
  throw new Error("State is invalid");
};

export const validateOrDefaultsToStateV1 = (
  state: unknown
): StateV1 | Promise<StateV1> => {
  const sanitized = preprocessState(state);
  const v1Parsed = stateSchemaV1.safeParse(sanitized);
  if (v1Parsed.success) {
    return v1Parsed.data;
  }

  const v0Parsed = stateSchemaV0.safeParse(sanitized);
  if (v0Parsed.success) {
    return {
      ...v0Parsed.data,
      version: 1,
    };
  }

  return Promise.resolve(validateOrDefaultsToStateV0(state)).then(
    (migratedState) => ({
      ...migratedState,
      version: 1,
    })
  );
};
