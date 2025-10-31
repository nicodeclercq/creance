import * as z from "zod";

import { accountSchema } from "../../models/Account";
import { eventSchema } from "../../models/Event";
import { ANONYMOUS_USER, userSchema } from "../../models/User";
import { Logger } from "../../service/Logger";
import { openDialog } from "../../ui/DialogProvider/DialogStackHook";
import { ResetStateConfirmationDialog } from "./ResetStateConfirmationDialog";

export const stateSchemaV0 = z.strictObject({
  users: z.record(z.string().max(100), userSchema),
  events: z.record(z.string().max(100), eventSchema),
  account: accountSchema,
});

export type StateV0 = z.infer<typeof stateSchemaV0>;

const DEFAULT_STATE_V0 = {
  account: {
    currentUser: ANONYMOUS_USER,
    events: {},
  },
  events: {},
  users: {},
} satisfies StateV0;

export const validateOrDefaultsToStateV0 = (
  state: unknown
): StateV0 | Promise<StateV0> => {
  const parsed = stateSchemaV0.safeParse(state);
  if (parsed.success) {
    return parsed.data;
  }

  if (state !== undefined) {
    Logger.error("Invalid state")(state, parsed.error);
    return openDialog({
      component: ResetStateConfirmationDialog,
      title: "ResetStateConfirmationDialog.title",
    }).then((result) => {
      if (result.type === "submit") {
        return DEFAULT_STATE_V0;
      } else {
        throw new Error("State is invalid");
      }
    });
  }
  return DEFAULT_STATE_V0;
};
