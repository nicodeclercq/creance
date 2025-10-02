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
  _id: z.string().max(100),
  name: z.string().max(100),
  avatar: z.string().max(100),
  share: z.strictObject({
    adults: z.number(),
    children: z.number(),
  }),
  updatedAt: z
    .string()
    .transform((date) => (date == null ? new Date() : new Date(date))),
});

export type User = z.infer<typeof userSchema>;
