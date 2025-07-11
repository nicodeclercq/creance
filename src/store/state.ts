import { Account } from "../models/Account";
import { Event } from "../models/Event";

export type State = {
  currentParticipantId: string;
  events: Record<string, Event>;
  account: null | Account;
};

export const DEFAULT_STATE = {
  currentParticipantId: "",
  account: null,
  events: {},
} as State;
