import * as z from "zod";

import { asNumber, isValidCalculation } from "../helpers/Number";

export const defaultShareSchema = z.strictObject({
  type: z.literal("default"),
});

export type DefaultShare = z.infer<typeof defaultShareSchema>;

export const percentageShareSchema = z.strictObject({
  type: z.literal("percentage"),
  distribution: z.record(
    z.string().max(100, "Expense.validation.distribution.key.maxLength"),
    z.string().max(100, "Expense.validation.distribution.value.maxLength")
  ),
});

export type PercentageShare = z.infer<typeof percentageShareSchema>;

export const fixedShareSchema = z.strictObject({
  type: z.literal("fixed"),
  distribution: z.record(
    z.string().max(100, "Expense.validation.distribution.key.maxLength"),
    z.string().max(100, "Expense.validation.distribution.value.maxLength")
  ),
});

export type FixedShare = z.infer<typeof fixedShareSchema>;

export const shareSchema = z.union([
  defaultShareSchema,
  percentageShareSchema,
  fixedShareSchema,
]);
export type Share = z.infer<typeof shareSchema>;

export const expenseSchema = z.strictObject({
  _id: z.string().max(100, "Expense.validation.id.maxLength"),
  reason: z.string().max(100, "Expense.validation.reason.maxLength"),
  category: z.string().max(100, "Expense.validation.category.maxLength"),
  amount: z
    .string()
    .max(100, "Expense.validation.amount.maxLength")
    .refine(
      (val) => isValidCalculation(val),
      "Expense.validation.amount.isNumber"
    )
    .refine((val) => {
      const amount = asNumber(val);
      return amount > 0;
    }, "Expense.validation.amount.positive"),
  date: z.union([z.string().transform((date) => new Date(date)), z.date()]),
  share: shareSchema,
  lender: z.string().max(100, "Expense.validation.lender.maxLength"),
  updatedAt: z.union([
    z.string().transform((date) => new Date(date)),
    z.date(),
  ]),
});

export type Expense = z.infer<typeof expenseSchema>;
