import * as z from "zod";

import { addDays, isBefore } from "../utils/date";

import { activitySchema } from "./Activity";
import { categorySchema } from "./Category";
import { depositSchema } from "./Deposit";
import { expenseSchema } from "./Expense";
import { participantSchema } from "./Participant";
import { periodSchema } from "./Period";

export const DAYS_BEFORE_CLOSE = 7;

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
  updatedAt: z.union([
    z.string().transform((date) => new Date(date)),
    z.date(),
  ]),
  isAutoClose: z.boolean().optional(),
  mealManager: z.record(
    z.string().max(100),
    z.strictObject({
      lunch: z.union([z.string().max(100), z.undefined()]),
      dinner: z.union([z.string().max(100), z.undefined()]),
    })
  ),
  activities: z.record(z.string().max(100), activitySchema),
});

export type Event = z.infer<typeof eventSchema>;

export const shouldCloseEvent = (event: Event): boolean => {
  const now = new Date();
  const canAutoClose = isBefore(now);
  const autoCloseDay = addDays(DAYS_BEFORE_CLOSE, event.period.end);

  return event.isAutoClose && !event.isClosed
    ? canAutoClose(autoCloseDay)
    : false;
};
