import * as z from "zod";

import { createMergeableRecord, mergeableRecord } from "./mergeable";

import { uid } from "../service/crypto";

export const ANONYMOUS_USER = createMergeableRecord({
  _id: uid(),
  name: "Anonymous",
  avatar: "",
  share: {
    adults: 1,
    children: 0,
  },
});

export const userSchema = mergeableRecord({
  _id: z.string().max(100, "User.validation.id.maxLength"),
  name: z.string().max(100, "User.validation.name.maxLength"),
  avatar: z.string().max(100, "User.validation.avatar.maxLength"),
  share: z.strictObject({
    adults: z.number("User.validation.share.adults.invalid"),
    children: z.number("User.validation.share.children.invalid"),
  }),
});

export type User = z.infer<typeof userSchema>;
