import * as Either from "fp-ts/Either";
import * as z from "zod";

import { CATEGORY_ICONS_NAMES } from "../ui/CategoryIcon/private";
import { State } from "../store/state";
import type { ZodError } from "zod";

const defaultParticipantShareSchema = z.strictObject({
  type: z.literal("default"),
});

const customParticipantShareSchema = z.strictObject({
  type: z.literal("custom"),
  shares: z.array(
    z.strictObject({
      label: z.string(),
      multiplier: z.strictObject({
        adults: z.number(),
        children: z.number(),
      }),
      period: z.strictObject({
        start: z.string().transform((date) => new Date(date)),
        end: z.string().transform((date) => new Date(date)),
        arrival: z.enum(["AM", "PM"]),
        departure: z.enum(["AM", "PM"]),
      }),
    })
  ),
});

export const participantShareSchema = z.union([
  defaultParticipantShareSchema,
  customParticipantShareSchema,
]);

const defaultExpenseShareSchema = z.strictObject({
  type: z.literal("default"),
});
const percentageExpenseShareSchema = z.strictObject({
  type: z.literal("percentage"),
  distribution: z.record(z.string(), z.string()),
});

const fixedExpenseShareSchema = z.strictObject({
  type: z.literal("fixed"),
  distribution: z.record(z.string(), z.string()),
});

export const expenseShareSchema = z.union([
  defaultExpenseShareSchema,
  percentageExpenseShareSchema,
  fixedExpenseShareSchema,
]);

export const expenseSchema = z.strictObject({
  _id: z.string(),
  reason: z.string(),
  category: z.string(),
  amount: z.string(),
  date: z.string().transform((date) => new Date(date)),
  share: expenseShareSchema,
  lender: z.string(),
  updatedAt: z
    .string()
    .transform((date) => (date == null ? new Date() : new Date(date))),
});

export const userSchema = z.strictObject({
  _id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  share: z.strictObject({
    adults: z.number(),
    children: z.number(),
  }),
  updatedAt: z
    .string()
    .transform((date) => (date == null ? new Date() : new Date(date))),
});

export const participantSchema = userSchema.extend({
  participantShare: participantShareSchema,
});

export const categorySchema = z.strictObject({
  _id: z.string(),
  name: z.string(),
  icon: z.enum(CATEGORY_ICONS_NAMES),
});

export const periodSchema = z.strictObject({
  start: z.string().transform((date) => new Date(date)),
  end: z.string().transform((date) => new Date(date)),
  arrival: z.enum(["AM", "PM"]),
  departure: z.enum(["AM", "PM"]),
});

export const depositSchema = z.strictObject({
  _id: z.string(),
  amount: z.string(),
  updatedAt: z
    .string()
    .transform((date) => (date == null ? new Date() : new Date(date))),
  date: z
    .string()
    .transform((date) => (date == null ? new Date() : new Date(date))),
  from: z.string(),
  to: z.string(),
  note: z.string(),
});

export const eventSchema = z.strictObject({
  _id: z.string(),
  isClosed: z.boolean().optional(),
  name: z.string(),
  participants: z.record(z.string(), participantSchema),
  period: periodSchema,
  description: z.string(),
  expenses: z.record(z.string(), expenseSchema),
  deposits: z.record(z.string(), depositSchema),
  categories: z.record(z.string(), categorySchema),
  updatedAt: z
    .string()
    .transform((date) => (date == null ? new Date() : new Date(date))),
  isAutoClose: z.boolean().optional(),
});

export const accountSchema = userSchema.extend({
  events: z.record(
    z.string(),
    z.object({
      key: z.string(),
      uid: z.string(),
    })
  ),
});

const stateSchema = z.strictObject({
  currentParticipantId: z.string(),
  events: z.record(z.string(), eventSchema),
  account: accountSchema.nullable(),
});

export const toState = (data: unknown): Either.Either<ZodError, State> => {
  const parsed = stateSchema.safeParse(data);
  if (!parsed.success) {
    return Either.left(parsed.error);
  }

  return Either.right(parsed.data);
};

export const fromState = (state: State): string => {
  return JSON.stringify(state);
};
