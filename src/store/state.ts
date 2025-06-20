import { Deposit } from "../models/Deposit";
import { Event } from "../models/Event";
import { Expense } from "../models/Expense";
import { User } from "../models/User";

export type State = {
  currentUserId: string;
  users: Record<string, User>;
  events: Record<string, Event>;
  expenses: Record<string, Expense>;
  deposits: Record<string, Deposit>;
};

export const DEFAULT_STATE = {
  currentUserId: "",
  users: {},
  events: {},
  expenses: {},
  deposits: {},
} as State;
