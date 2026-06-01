import * as RecordFP from "fp-ts/Record";

import { generateKey, uid } from "../../service/crypto";

import type { Adapter } from "../createStore";
import type { State } from "../state";
import { pipe } from "fp-ts/function";
import { shouldCloseEvent } from "../../models/Event";
import type { User } from "../../models/User";
import {
  type MergeableCollection,
  sanitizeMergeableCollection,
} from "../../models/mergeable";

/**
 * After the end and a delay some events are automatically closed.
 */
export const autoCloseEvents = (state: State): State => {
  const autoClosedEvents = Object.values(state.events.collection)
    .filter(shouldCloseEvent)
    .map((event) => event._id);

  if (autoClosedEvents.length > 0) {
    const newCollection = pipe(
      state.events.collection,
      RecordFP.map((event) =>
        autoClosedEvents.includes(event._id)
          ? { ...event, isClosed: true }
          : event,
      ),
    );

    return {
      ...state,
      events: {
        ...state.events,
        collection: newCollection,
        updatedAt: new Date(),
      },
    };
  }
  return state;
};

export const sanitizeUsersCollection = (state: State): State => {
  const users = sanitizeMergeableCollection<User>(state.users);

  return users === state.users
    ? state
    : {
        ...state,
        users: users as MergeableCollection<User>,
      };
};

/**
 * Some participants are added in events and need to be also added to the users store.
 * So that they can be used in future events.
 */
export const fillInMissingParticipants = (state: State): State => {
  const participants = Object.values(state.events.collection).flatMap((event) =>
    Object.values(event.participants.collection),
  );
  const missingParticipants = participants.filter(
    (participant) => !(participant._id in state.users.collection),
  );

  if (missingParticipants.length > 0) {
    const newUsersCollection = {
      ...state.users.collection,
      ...Object.fromEntries(
        missingParticipants.map(({ participantShare, ...user }) => [
          user._id,
          user,
        ]),
      ),
    };
    return {
      ...state,
      users: {
        ...state.users,
        collection: newUsersCollection,
        updatedAt: new Date(),
      },
    };
  }

  return state;
};

export const removeDanglingAccountEvents = (state: State): State => {
  const danglingEventIds = Object.keys(state.account.events.collection).filter(
    (eventId) => state.events.collection[eventId] === undefined,
  );

  return danglingEventIds.length > 0
    ? {
        ...state,
        account: {
          ...state.account,
          events: {
            ...state.account.events,
            collection: danglingEventIds.reduce((acc, eventId) => {
              const { [eventId]: removed, ...others } = acc;
              return others;
            }, state.account.events.collection),
            updatedAt: new Date(),
          },
          updatedAt: new Date(),
        },
      }
    : state;
};

export const fillInMissingAccountEvents = (state: State): Promise<State> => {
  const missingEventIds = Object.keys(state.events.collection).filter(
    (eventId) => state.account.events.collection[eventId] === undefined,
  );

  return missingEventIds.length === 0
    ? Promise.resolve(state)
    : Promise.all(
        missingEventIds.map((eventId) =>
          generateKey(uid()).then((eventKey) => [eventId, eventKey] as const),
        ),
      ).then((generatedEventKeys) => {
        const now = new Date();
        const generatedAccountEvents = generatedEventKeys.reduce<
          typeof state.account.events.collection
        >(
          (acc, [eventId, eventKey]) => ({
            ...acc,
            [eventId]: {
              eventId: eventKey,
              userId: state.account.currentUser._id,
              updatedAt: now,
            },
          }),
          {},
        );

        return {
          ...state,
          account: {
            ...state.account,
            events: {
              ...state.account.events,
              collection: {
                ...state.account.events.collection,
                ...generatedAccountEvents,
              },
              updatedAt: now,
            },
            updatedAt: now,
          },
        };
      });
};

export const createInitTasksAdapter = (): Adapter<State> => {
  const runTasks = (state: State): Promise<State> =>
    Promise.resolve(state)
      .then(sanitizeUsersCollection)
      .then(autoCloseEvents)
      .then(fillInMissingParticipants)
      .then(removeDanglingAccountEvents)
      .then(fillInMissingAccountEvents);

  return {
    load: (prev) =>
      prev === undefined ? undefined : Promise.resolve(prev).then(runTasks),
    onChange: () => {
      // No persistence needed for init tasks
    },
  };
};

export const InitTasksAdapter = createInitTasksAdapter();
