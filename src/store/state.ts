import { Event } from "../models/Event";
import { User } from "../models/User";
import { uid } from "../uid";

export type State = {
  layout: {
    pageTitle: string;
  };
  currentUserId: string;
  users: Record<string, User>;
  events: Record<string, Event>;
};

const currentUserId = uid();

export const DEFAULT_STATE = {
  layout: {
    pageTitle: "Créances",
  },
  currentUserId,
  users: {
    [currentUserId]: {
      _id: currentUserId,
      name: "Nicolas et Valentine",
      avatar: "",
      share: {
        adult: 2,
        children: 3,
      },
    },
  },
  events: {},
} as State;
