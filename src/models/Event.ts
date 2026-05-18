import * as z from "zod";

import { addDays, isBefore } from "../utils/date";
import { mergeableCollection, mergeableRecord } from "./mergeable";

import { activitySchema } from "./Activity";
import { categorySchema } from "./Category";
import { depositSchema } from "./Deposit";
import { expenseSchema } from "./Expense";
import { participantSchema } from "./Participant";
import { periodSchema } from "./Period";

export const DAYS_BEFORE_CLOSE = 7;

const mealManagerEntrySchema = z.strictObject({
  lunch: z.union([z.string().max(100), z.undefined()]),
  dinner: z.union([z.string().max(100), z.undefined()]),
});

export const eventSchema = mergeableRecord({
  _id: z.string().max(100),
  isClosed: z.boolean().optional(),
  name: z.string().max(100),
  participants: mergeableCollection(participantSchema),
  period: periodSchema,
  description: z.string().max(100),
  expenses: mergeableCollection(expenseSchema),
  deposits: mergeableCollection(depositSchema),
  categories: mergeableCollection(categorySchema),
  isAutoClose: z.boolean().optional(),
  mealManager: z.record(z.string(), mealManagerEntrySchema),
  activities: mergeableCollection(activitySchema),
  hasProgram: z.boolean().optional(),
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
