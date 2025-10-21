import * as RecordFP from "fp-ts/Record";

import type { State } from "../state";
import type { StoreAdapter } from "../StoreManager";
import { flow } from "fp-ts/function";
import { pipe } from "fp-ts/function";
import { shouldCloseEvent } from "../../models/Event";

/**
 * After the end and a delay some events are automatically closed.
 */
const autoCloseEvents = (state: State): State => {
  const autoClosedEvents = Object.values(state.events)
    .filter(shouldCloseEvent)
    .map((event) => event._id);

  if (autoClosedEvents.length > 0) {
    const newEvents = pipe(
      state.events,
      RecordFP.map((event) =>
        autoClosedEvents.includes(event._id)
          ? { ...event, isClosed: true }
          : event
      )
    );

    return { ...state, events: newEvents };
  }
  return state;
};

/**
 * Some participants are added in events and need to be also added to the users store.
 * So that they can be used in future events.
 */
const fillInMissingParticipants = (state: State): State => {
  const participants = Object.values(state.events).flatMap((event) =>
    Object.values(event.participants)
  );
  const missingParticipants = participants.filter(
    (participant) => !(participant._id in state.users)
  );

  if (missingParticipants.length > 0) {
    const newUsers = {
      ...state.users,
      ...Object.fromEntries(
        missingParticipants.map(({ participantShare, ...user }) => [
          user._id,
          user,
        ])
      ),
    };
    return { ...state, users: newUsers };
  }

  return state;
};

export const InitializationTasks: StoreAdapter<State> = {
  initializer: flow(autoCloseEvents, fillInMissingParticipants),
  onStateChange: () => {},
};
