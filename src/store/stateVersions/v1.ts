import * as z from "zod";

import {
  DEFAULT_STATE_V0,
  stateSchemaV0,
  validateOrDefaultsToStateV0,
} from "./v0";

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
  const v1Parsed = stateSchemaV1.safeParse(state);
  if (v1Parsed.success) {
    return v1Parsed.data;
  }

  const v0Parsed = stateSchemaV0.safeParse(state);
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
