import * as z from "zod";

import { userSchema } from "./User";

export const accountSchema = z.strictObject({
  currentUser: userSchema,
  events: z.record(
    z.string().max(100, "Account.validation.events.maxLength"),
    z.object({
      key: z.string().max(100, "Account.validation.events.key.maxLength"),
      uid: z.string().max(100, "Account.validation.events.uid.maxLength"),
    })
  ),
});

export type Account = z.infer<typeof accountSchema>;
