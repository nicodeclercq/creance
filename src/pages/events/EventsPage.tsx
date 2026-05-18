import { EventList } from "./EventList";
import { sortByDate } from "../../utils/date";
import { useCurrentUser } from "../../store/useCurrentUser";
import { useData } from "../../store/useData";

export function EventsPage() {
  const [events] = useData("events");
  const { userId } = useCurrentUser();

  const eventsArray = Object.values(events.collection).sort(
    sortByDate("updatedAt", "desc"),
  );

  const filteredEvents = eventsArray.filter((event) => {
    const eventParticipants = Object.keys(event.participants.collection);
    return eventParticipants.includes(userId);
  });

  return <EventList events={filteredEvents} currentParticipantId={userId} />;
}
