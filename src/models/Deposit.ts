import * as z from "zod";

export const depositSchema = z.strictObject({
  _id: z.string().max(100),
  amount: z.string().max(100),
  from: z.string().max(100),
  to: z.string().max(100),
  note: z.string().max(100),
  updatedAt: z.string().transform((date) => new Date(date)),
  date: z.string().transform((date) => new Date(date)),
});

export type Deposit = z.infer<typeof depositSchema>;
