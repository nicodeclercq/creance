import { EventList } from "./EventList";
import { sortByDate } from "../../utils/date";
import { useData } from "../../store/useData";

export function EventsPage() {
  const [events] = useData("events");
  const [currentParticipantId] = useData("account.currentUser._id");

  const eventsArray = Object.values(events).sort(
    sortByDate("updatedAt", "desc")
  );

  const filteredEvents = eventsArray.filter((event) => {
    const eventParticipants = Object.keys(event.participants);
    return eventParticipants.includes(currentParticipantId);
  });

  return (
    <EventList
      events={filteredEvents}
      currentParticipantId={currentParticipantId}
    />
  );
}
