import type { Deposit } from "../models/Deposit";
import type { Event } from "../models/Event";
import type { Expense } from "../models/Expense";
import type { Participant } from "../models/Participant";
import { PAST_DATE } from "../models/mergeable";
import { uid } from "./crypto";

export const createEvent = (defaultValues: Partial<Event> = {}): Event => ({
  _id: uid(),
  name: "Event Name",
  description: "",
  participants: {
    collection: {},
    updatedAt: PAST_DATE,
  },
  categories: {
    collection: {
      Food: {
        _id: uid(),
        name: "Food",
        icon: "axe",
        updatedAt: PAST_DATE,
      },
      Transport: {
        _id: uid(),
        name: "Transport",
        icon: "axe",
        updatedAt: PAST_DATE,
      },
    },
    updatedAt: PAST_DATE,
  },
  deposits: {
    collection: {},
    updatedAt: PAST_DATE,
  },
  expenses: {
    collection: {},
    updatedAt: PAST_DATE,
  },
  isClosed: false,
  period: {
    start: PAST_DATE,
    arrival: "PM",
    end: PAST_DATE,
    departure: "PM",
  },
  updatedAt: new Date(),
  mealManager: {},
  activities: {
    collection: {},
    updatedAt: PAST_DATE,
  },
  ...defaultValues,
});
export const createExpense = (
  defaultValues: Partial<Expense> = {}
): Expense => ({
  _id: uid(),
  category: uid(),
  lender: uid(),
  date: PAST_DATE,
  updatedAt: PAST_DATE,
  reason: "Expense Reason",
  amount: "100",
  share: { type: "default" },
  ...defaultValues,
});
export const createParticipant = (
  defaultValues: Partial<Participant> = {}
): Participant => ({
  _id: uid(),
  name: "Participant Name",
  share: {
    adults: 1,
    children: 0,
  },
  participantShare: { type: "default" },
  updatedAt: PAST_DATE,
  avatar: "",
  ...defaultValues,
});
export const createDeposit = (
  defaultValues: Partial<Deposit> = {}
): Deposit => ({
  _id: uid(),
  from: uid(),
  to: uid(),
  amount: "100",
  note: "Deposit Reason",
  date: PAST_DATE,
  updatedAt: PAST_DATE,
  ...defaultValues,
});
