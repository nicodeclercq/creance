import { EventList } from "./EventList";
import { sortByDate } from "../../utils/date";
import { useData } from "../../store/useData";

export function EventsPage() {
  const [events] = useData("events");
  const [account] = useData("account");

  const eventsArray = Object.values(events.collection).sort(
    sortByDate("updatedAt", "desc"),
  );

  const filteredEvents = eventsArray.filter(
    (event) => event._id in account.events.collection,
  );

  return <EventList events={filteredEvents} />;
}
