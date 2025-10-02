import * as z from "zod";

export const defaultShareSchema = z.strictObject({
  type: z.literal("default"),
});

export type DefaultShare = z.infer<typeof defaultShareSchema>;

export const percentageShareSchema = z.strictObject({
  type: z.literal("percentage"),
  distribution: z.record(z.string().max(100), z.string().max(100)),
});

export type PercentageShare = z.infer<typeof percentageShareSchema>;

export const fixedShareSchema = z.strictObject({
  type: z.literal("fixed"),
  distribution: z.record(z.string().max(100), z.string().max(100)),
});

export type FixedShare = z.infer<typeof fixedShareSchema>;

export const shareSchema = z.union([
  defaultShareSchema,
  percentageShareSchema,
  fixedShareSchema,
]);
export type Share = z.infer<typeof shareSchema>;

export const expenseSchema = z.strictObject({
  _id: z.string().max(100),
  reason: z.string().max(100),
  category: z.string().max(100),
  amount: z.string().max(100),
  date: z.string().transform((date) => new Date(date)),
  share: shareSchema,
  lender: z.string().max(100),
  updatedAt: z.string().transform((date) => new Date(date)),
});

export type Expense = z.infer<typeof expenseSchema>;
