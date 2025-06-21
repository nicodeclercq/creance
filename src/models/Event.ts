import { addDays, isBefore } from "../utils/date";

import { Category } from "./Category";
import { Period } from "./Period";

export const DELAY_BEFORE_CLOSE = 7;

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
  expenses: string[];
  deposits: string[];
  categories: Record<string, Category>;
  participants: string[];
  updatedAt: Date;
  isAutoClose?: boolean;
};

export const shouldCloseEvent = (event: Event): boolean => {
  const now = new Date();
  const canAutoClose = isBefore(now);

  if (event.isAutoClose) {
    const autoCloseDay = addDays(DELAY_BEFORE_CLOSE, event.period.end);
    return canAutoClose(autoCloseDay);
  }
  return false;
};
