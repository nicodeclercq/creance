import * as z from "zod";

import { accountSchema } from "../models/Account";
import { eventSchema } from "../models/Event";
import { ANONYMOUS_USER, userSchema } from "../models/User";

export const stateSchema = z.strictObject({
  users: z.record(z.string().max(100), userSchema),
  events: z.record(z.string().max(100), eventSchema),
  account: accountSchema,
});

export type State = z.infer<typeof stateSchema>;

export const DEFAULT_STATE = {
  account: {
    currentUser: ANONYMOUS_USER,
    events: {},
  },
  events: {},
  users: {},
} satisfies State;
