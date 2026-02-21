import * as RecordFP from "fp-ts/Record";
import { flow, pipe } from "fp-ts/function";

import type { Adapter } from "../createStore";
import type { State } from "../state";
import { shouldCloseEvent } from "../../models/Event";

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
          : event
      )
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

/**
 * Some participants are added in events and need to be also added to the users store.
 * So that they can be used in future events.
 */
export const fillInMissingParticipants = (state: State): State => {
  const participants = Object.values(state.events.collection).flatMap((event) =>
    Object.values(event.participants.collection)
  );
  const missingParticipants = participants.filter(
    (participant) => !(participant._id in state.users.collection)
  );

  if (missingParticipants.length > 0) {
    const newUsersCollection = {
      ...state.users.collection,
      ...Object.fromEntries(
        missingParticipants.map(({ participantShare, ...user }) => [
          user._id,
          user,
        ])
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

export const createInitTasksAdapter = (): Adapter<State> => {
  const runTasks = flow(
    autoCloseEvents,
    fillInMissingParticipants,
  );

  return {
    load: (prev) => (prev === undefined ? undefined : runTasks(prev)),
    onChange: () => {
      // No persistence needed for init tasks
    },
  };
};

export const InitTasksAdapter = createInitTasksAdapter();
