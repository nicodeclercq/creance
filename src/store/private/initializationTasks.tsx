import * as RecordFP from "fp-ts/Record";

import type { State } from "../state";
import type { StoreAdapter } from "../StoreManager";
import { flow } from "fp-ts/function";
import { pipe } from "fp-ts/function";
import { shouldCloseEvent } from "../../models/Event";
import { ANONYMOUS_USER, type User } from "../../models/User";
import { openDialog } from "../../ui/DialogProvider/DialogStackHook";
import { SetCurrentParticipantForm } from "../../pages/auth/SetCurrentParticipantForm";
import { uid } from "../../service/crypto";

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

/**
 * If the current user is anonymous, we open a dialog to add its informations.
 */
const initParticipantDetailsIfAnonymous = (
  state: State
): State | Promise<State> => {
  if (state.account.currentUser._id === ANONYMOUS_USER._id) {
    return openDialog<User>({
      title: "page.setCurrentParticipant.title",
      component: ({ defaultData, onSubmit, onCancel }) => (
        <SetCurrentParticipantForm
          defaultData={defaultData}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      ),
    }).then((result) => {
      return {
        ...state,
        account: {
          ...state.account,
          currentUser:
            result.type === "submit"
              ? { ...result.data, _id: uid() } // we udpate the id to avoid showing the dialog twice
              : ANONYMOUS_USER,
        },
      };
    });
  }

  return state;
};

export const InitializationTasks: StoreAdapter<State> = {
  initializer: flow(
    autoCloseEvents,
    fillInMissingParticipants,
    initParticipantDetailsIfAnonymous
  ),
  onStateChange: () => {},
};
