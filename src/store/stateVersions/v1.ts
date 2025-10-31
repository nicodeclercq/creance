import * as z from "zod";

import { stateSchemaV0, validateOrDefaultsToStateV0 } from "./v0";

/**
 * Adds version number to state
 */
export const stateSchemaV1 = z.strictObject({
  ...stateSchemaV0.shape,
  version: z.literal(1),
});

export type StateV1 = z.infer<typeof stateSchemaV1>;

export const validateOrDefaultsToStateV1 = (
  state: unknown
): StateV1 | Promise<StateV1> => {
  const parsed = stateSchemaV1.safeParse(state);
  if (parsed.success) {
    return parsed.data;
  }

  return Promise.resolve()
    .then(() => validateOrDefaultsToStateV0(state))
    .then((state) => ({
      ...state,
      version: 1,
    }));
};
