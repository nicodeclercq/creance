import * as z from "zod";

import { userSchema } from "./User";

export const accountSchema = z.strictObject({
  currentUser: userSchema,
  events: z.record(
    z.string().max(100),
    z.object({
      key: z.string().max(100),
      uid: z.string().max(100),
    })
  ),
});

export type Account = z.infer<typeof accountSchema>;
