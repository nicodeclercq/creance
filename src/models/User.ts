import * as z from "zod";
import { uid } from "../service/crypto";

export const ANONYMOUS_USER = {
  _id: uid(),
  name: "Anonymous",
  avatar: "/anonymous.svg",
  share: {
    adults: 1,
    children: 0,
  },
  updatedAt: new Date("2025-01-01"),
} satisfies User;

export const userSchema = z.strictObject({
  _id: z.string().max(100, "User.validation.id.maxLength"),
  name: z.string().max(100, "User.validation.name.maxLength"),
  avatar: z.string().max(100, "User.validation.avatar.maxLength"),
  share: z.strictObject({
    adults: z.number("User.validation.share.adults.invalid"),
    children: z.number("User.validation.share.children.invalid"),
  }),
  updatedAt: z.union(
    [z.string().transform((date) => new Date(date)), z.date()],
    "User.validation.updatedAt.invalid"
  ),
});

export type User = z.infer<typeof userSchema>;
