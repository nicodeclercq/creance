import * as Either from "fp-ts/Either";
import * as z from "zod";

import { CATEGORY_ICONS_NAMES } from "../ui/CategoryIcon/private";
import { State } from "../store/state";
import { User } from "../models/User";
import type { ZodError } from "zod";

const defaultParticipantShareSchema = z.strictObject({
  type: z.literal("default"),
});

const customParticipantShareSchema = z.strictObject({
  type: z.literal("custom"),
  shares: z.array(
    z.strictObject({
      label: z.string().max(100),
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
  distribution: z.record(z.string().max(100), z.string().max(100)),
});

const fixedExpenseShareSchema = z.strictObject({
  type: z.literal("fixed"),
  distribution: z.record(z.string().max(100), z.string().max(100)),
});

export const expenseShareSchema = z.union([
  defaultExpenseShareSchema,
  percentageExpenseShareSchema,
  fixedExpenseShareSchema,
]);

export const expenseSchema = z.strictObject({
  _id: z.string().max(100),
  reason: z.string().max(100),
  category: z.string().max(100),
  amount: z.string().max(100),
  date: z.string().transform((date) => new Date(date)),
  share: expenseShareSchema,
  lender: z.string().max(100),
  updatedAt: z
    .string()
    .transform((date) => (date == null ? new Date() : new Date(date))),
});

export const userSchema = z.strictObject({
  _id: z.string().max(100),
  name: z.string().max(100),
  avatar: z.string().max(100).optional(),
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
  _id: z.string().max(100),
  name: z.string().max(100),
  icon: z.enum(CATEGORY_ICONS_NAMES),
});

export const periodSchema = z.strictObject({
  start: z.string().transform((date) => new Date(date)),
  end: z.string().transform((date) => new Date(date)),
  arrival: z.enum(["AM", "PM"]),
  departure: z.enum(["AM", "PM"]),
});

export const depositSchema = z.strictObject({
  _id: z.string().max(100),
  amount: z.string().max(100),
  updatedAt: z
    .string()
    .transform((date) => (date == null ? new Date() : new Date(date))),
  date: z
    .string()
    .transform((date) => (date == null ? new Date() : new Date(date))),
  from: z.string().max(100),
  to: z.string().max(100),
  note: z.string().max(100),
});

export const eventSchema = z.strictObject({
  _id: z.string().max(100),
  isClosed: z.boolean().optional(),
  name: z.string().max(100),
  participants: z.record(z.string().max(100), participantSchema),
  period: periodSchema,
  description: z.string().max(100),
  expenses: z.record(z.string().max(100), expenseSchema),
  deposits: z.record(z.string().max(100), depositSchema),
  categories: z.record(z.string().max(100), categorySchema),
  updatedAt: z
    .string()
    .transform((date) => (date == null ? new Date() : new Date(date))),
  isAutoClose: z.boolean().optional(),
});

export const accountSchema = userSchema.extend({
  events: z.record(
    z.string().max(100),
    z.object({
      key: z.string().max(100),
      uid: z.string().max(100),
    })
  ),
  users: z
    .union([
      z.array(userSchema).transform((arr) =>
        arr.reduce((acc, cur) => {
          acc[cur._id] = cur;
          return acc;
        }, {} as Record<string, User>)
      ),
      z.record(z.string().max(100), userSchema),
    ])
    .optional()
    .default({}),
});

const stateSchema = z.strictObject({
  currentParticipantId: z.string().max(100),
  events: z.record(z.string().max(100), eventSchema),
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
