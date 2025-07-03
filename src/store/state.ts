import { Event } from "../models/Event";
import { Participant } from "../models/Participant";

export type Account = Omit<Participant, "participantShare"> & {
  eventKeys: Record<string, string>;
};

export type State = {
  currentParticipantId: string;
  events: Record<string, Event>;
  account: Account;
};

export const DEFAULT_STATE = {
  currentParticipantId: "",
  account: {} as Account,
  events: {},
} as State;
