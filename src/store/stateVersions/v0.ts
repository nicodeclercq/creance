import * as z from "zod";

import { ANONYMOUS_USER, userSchema } from "../../models/User";
import {
  PAST_DATE,
  createEmptyMergeableCollection,
  mergeableCollection,
  updatedAtSchema,
} from "../../models/mergeable";
import { accountSchema, createEmptyAccount } from "../../models/Account";

import { Logger } from "../../service/Logger";
import { eventSchema } from "../../models/Event";

export const stateSchemaV0 = z.strictObject({
  users: mergeableCollection(userSchema),
  events: mergeableCollection(eventSchema),
  account: accountSchema,
  updatedAt: updatedAtSchema,
});

export type StateV0 = z.infer<typeof stateSchemaV0>;

export const DEFAULT_STATE_V0: StateV0 = {
  account: createEmptyAccount(ANONYMOUS_USER),
  events: createEmptyMergeableCollection(),
  users: createEmptyMergeableCollection(),
  updatedAt: PAST_DATE,
};

export const validateStateV0 = (state: unknown): StateV0 => {
  const parsed = stateSchemaV0.safeParse(state);
  if (parsed.success) {
    return parsed.data;
  }

  Logger.error("State validation failed")(parsed.error);
  throw new Error("State is invalid");
};

export const validateOrDefaultsToStateV0 = (
  state: unknown,
): StateV0 | Promise<StateV0> => {
  const parsed = stateSchemaV0.safeParse(state);
  if (parsed.success) {
    return parsed.data;
  }

  if (state === undefined) {
    return DEFAULT_STATE_V0;
  }

  Logger.error("Invalid state")(state);
  return Promise.all([
    import("../../ui/DialogProvider/DialogStackHook"),
    import("./ResetStateConfirmationDialog"),
  ])
    .then(([{ openDialog }, { ResetStateConfirmationDialog }]) =>
      openDialog<unknown>({
        component: ResetStateConfirmationDialog(state),
        title: "ResetStateConfirmationDialog.title",
      }),
    )
    .then((result) =>
      result.type === "submit"
        ? ((result.data as StateV0) ?? DEFAULT_STATE_V0)
        : Promise.reject(new Error("State is invalid")),
    );
};
