import { Event } from "../models/Event";
import { User } from "../models/User";

export type State = {
  currentUserId: string;
  users: Record<string, User>;
  events: Record<string, Event>;
};

export const DEFAULT_STATE = {
  currentUserId: "",
  users: {},
  events: {},
} as State;
