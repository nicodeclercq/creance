import * as RecordFP from "fp-ts/Record";

import { EventList } from "./EventList";
import { pipe } from "fp-ts/function";
import { shouldCloseEvent } from "../../models/Event";
import { useStore } from "../../store/StoreProvider";

export function EventsPage() {
  const [events, setEvents] = useStore("events");
  const [users] = useStore("users");

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

  return <EventList events={Object.values(events)} users={users} />;
}
