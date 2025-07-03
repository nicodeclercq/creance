import { addDays, isBefore } from "../utils/date";

import type { Category } from "./Category";
import type { Deposit } from "./Deposit";
import type { Expense } from "./Expense";
import type { Participant } from "./Participant";
import type { Period } from "./Period";
import { foldParticipantShare } from "./ParticipantShare";

export const DAYS_BEFORE_CLOSE = 7;

export type Event = {
  _id: string;
  isClosed?: boolean;
  name: string;
  participants: Record<string, Participant>;
  period: Period;
  description: string;
  expenses: Record<string, Expense>;
  deposits: Record<string, Deposit>;
  categories: Record<string, Category>;
  updatedAt: Date;
  isAutoClose?: boolean;
};

export const shouldCloseEvent = (event: Event): boolean => {
  const now = new Date();
  const canAutoClose = isBefore(now);
  const autoCloseDay = addDays(DAYS_BEFORE_CLOSE, event.period.end);

  return event.isAutoClose && !event.isClosed
    ? canAutoClose(autoCloseDay)
    : false;
};

export { foldParticipantShare };
