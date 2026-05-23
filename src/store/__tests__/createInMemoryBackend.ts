import { BehaviorSubject } from "rxjs";
import type { RemoteOperations } from "../adapters/createRemoteAdapter";

export type InMemoryBackend = {
  operations: RemoteOperations;
  getUserData: () => string | undefined;
  setUserData: (data: string | undefined) => void;
  getEventData: (eventId: string) => string | undefined;
  hasEventData: (eventId: string) => boolean;
  eventIds: () => string[];
};

export const createInMemoryBackend = (): InMemoryBackend => {
  const userDataSubject = new BehaviorSubject<string | undefined>(undefined);
  const eventDataSubjects = new Map<
    string,
    BehaviorSubject<string | undefined>
  >();

  const getOrCreateEventSubject = (
    eventId: string,
  ): BehaviorSubject<string | undefined> => {
    const existing = eventDataSubjects.get(eventId);
    if (existing) return existing;
    const subject = new BehaviorSubject<string | undefined>(undefined);
    eventDataSubjects.set(eventId, subject);
    return subject;
  };

  const operations: RemoteOperations = {
    name: "InMemory",
    login: ({ login }) => Promise.resolve(`user-${login}`),
    signup: ({ login }) => Promise.resolve(`user-${login}`),
    logout: () => Promise.resolve(),
    getUserData: () => userDataSubject.asObservable(),
    setUserData: (data) => {
      userDataSubject.next(data);
      return Promise.resolve();
    },
    getEventData: (eventId) => getOrCreateEventSubject(eventId).asObservable(),
    setEventData: (eventId, data) => {
      getOrCreateEventSubject(eventId).next(data);
      return Promise.resolve();
    },
    deleteEventData: (eventId) => {
      eventDataSubjects.delete(eventId);
      return Promise.resolve();
    },
  };

  return {
    operations,
    getUserData: () => userDataSubject.getValue(),
    setUserData: (data) => userDataSubject.next(data),
    getEventData: (eventId) => eventDataSubjects.get(eventId)?.getValue(),
    hasEventData: (eventId) => eventDataSubjects.has(eventId),
    eventIds: () => [...eventDataSubjects.keys()],
  };
};
