import type { Deposit } from "../models/Deposit";
import type { Event } from "../models/Event";
import type { Expense } from "../models/Expense";
import type { Participant } from "../models/Participant";
import { uid } from "./crypto";

export const createEvent = (defaultValues: Partial<Event> = {}): Event => ({
  _id: uid(),
  name: "Event Name",
  description: "",
  participants: {},
  categories: {
    Food: {
      _id: uid(),
      name: "Food",
      icon: "axe",
    },
    Transport: {
      _id: uid(),
      name: "Transport",
      icon: "axe",
    },
  },
  deposits: {},
  expenses: {},
  isClosed: false,
  period: {
    start: new Date("2025-01-01"), // x1
    arrival: "PM",
    end: new Date("2025-01-01"),
    departure: "PM",
  },
  updatedAt: new Date(),
  mealManager: {},
  activities: {},
  ...defaultValues,
});
export const createExpense = (
  defaultValues: Partial<Expense> = {}
): Expense => ({
  _id: uid(),
  category: uid(),
  lender: uid(),
  date: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
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
  updatedAt: new Date("2025-01-01"),
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
  date: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
  ...defaultValues,
});
