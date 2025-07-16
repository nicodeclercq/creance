import * as RecordFP from "fp-ts/Record";

import { EventList } from "./EventList";
import { pipe } from "fp-ts/function";
import { shouldCloseEvent } from "../../models/Event";
import { useStore } from "../../store/StoreProvider";

export function EventsPage() {
  const [events, setEvents] = useStore("events");
  const [account, setAccount] = useStore("account");

  const autoClosedEvents = Object.values(events)
    .filter(shouldCloseEvent)
    .map((event) => event._id);

  if (autoClosedEvents.length > 0) {
    setEvents((currentEvents) =>
      pipe(
        currentEvents,
        RecordFP.map((event) =>
          autoClosedEvents.includes(event._id)
            ? { ...event, isClosed: true }
            : event
        )
      )
    );
    return null; // Prevent rendering while updating state
  }

  if (account) {
    const participants = Object.values(events).flatMap((event) =>
      Object.values(event.participants)
    );
    const missingParticipants = participants.filter(
      (participant) => !(participant._id in account.users)
    );

    if (missingParticipants.length > 0) {
      setAccount((currentAccount) => {
        if (!currentAccount) return null;

        return {
          ...currentAccount,
          users: {
            ...currentAccount.users,
            ...Object.fromEntries(
              missingParticipants.map(({ participantShare, ...user }) => [
                user._id,
                user,
              ])
            ),
          },
        };
      });
    }
  }

  return <EventList events={events} />;
}
