import * as z from "zod";

import { userSchema, type User } from "./User";
import {
  mergeableCollection,
  createEmptyMergeableCollection,
  mergeableRecord,
  createMergeableRecord,
} from "./mergeable";

const accountEventShape = {
  eventId: z.string().max(100, "Account.validation.events.key.maxLength"),
  userId: z.string().max(100, "Account.validation.events.uid.maxLength"),
};

export const accountEventSchema = mergeableRecord(accountEventShape);

export type AccountEvent = z.infer<typeof accountEventSchema>;

export const accountSchema = mergeableRecord({
  currentUser: userSchema,
  events: mergeableCollection(accountEventSchema),
});

export type Account = z.infer<typeof accountSchema>;

export const createEmptyAccount = (currentUser: User): Account =>
  createMergeableRecord({
    currentUser,
    events: createEmptyMergeableCollection(),
  });
