import * as z from "zod";

import { asNumber, isValidCalculation } from "../helpers/Number";

export const depositSchema = z.strictObject({
  _id: z.string().max(100, "Deposit.validation.id.maxLength"),
  amount: z
    .string()
    .max(100, "Deposit.validation.amount.maxLength")
    .refine(
      (val) => isValidCalculation(val),
      "Deposit.validation.amount.isNumber"
    )
    .refine((val) => {
      const amount = asNumber(val);
      return amount > 0;
    }, "Deposit.validation.amount.positive"),
  from: z.string().max(100, "Deposit.validation.from.maxLength"),
  to: z.string().max(100, "Deposit.validation.to.maxLength"),
  note: z.string().max(100, "Deposit.validation.note.maxLength"),
  updatedAt: z.union([
    z.string().transform((date) => new Date(date)),
    z.date(),
  ]),
  date: z.union([z.string().transform((date) => new Date(date)), z.date()]),
});

export type Deposit = z.infer<typeof depositSchema>;
