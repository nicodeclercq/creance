import { addDays, isBefore } from "../utils/date";

import { Category } from "./Category";
import { Deposit } from "./Deposit";
import { Expense } from "./Expense";
import { Period } from "./Period";

export const DAYS_BEFORE_CLOSE = 7;

export type DefaultUserShare = {
  type: "default";
};

export type CustomUserShareType = {
  label: string;
  multiplier: {
    adults: number;
    children: number;
  };
  period: {
    start: Date;
    end: Date;
    arrival: "AM" | "PM";
    departure: "AM" | "PM";
  };
};

export type CustomUserShare = {
  type: "custom";
  shares: CustomUserShareType[];
};

export type UserShare = DefaultUserShare | CustomUserShare;

export const foldUserShare =
  <T>({
    onDefault,
    onCustom,
  }: {
    onDefault: (share: DefaultUserShare) => T;
    onCustom: (share: CustomUserShare) => T;
  }) =>
  (share: UserShare) => {
    switch (share.type) {
      case "default":
        return onDefault(share);
      case "custom":
        return onCustom(share);
    }
  };

export type Event = {
  _id: string;
  isClosed?: boolean;
  name: string;
  shares: Record<string, UserShare>;
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
