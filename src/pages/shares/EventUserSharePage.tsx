import { EmptyEvent } from "../event/EmptyEvent";
import { EventNotFoundPage } from "../event/private/EventNotFoundPage";
import { EventPageTemplate } from "../../shared/PageTemplate/EventPageTemplate";
import { UserShareList } from "./private/UserShareList";
import { useEventUsers } from "../../hooks/useEventUsers";
import { useParams } from "react-router-dom";
import { useStore } from "../../store/StoreProvider";

export function EventUserSharePage() {
  const { eventId } = useParams();
  const [currentEvent] = useStore(`events.${eventId}`);
  const [currentUserId] = useStore("currentUserId");
  const users = useEventUsers(eventId);

  if (!eventId || !currentEvent) {
    return <EventNotFoundPage />;
  }

  if (Object.keys(currentEvent.expenses).length === 0) {
    return (
      <EventPageTemplate event={currentEvent}>
        <EmptyEvent event={currentEvent} />
      </EventPageTemplate>
    );
  }

  return (
    <EventPageTemplate event={currentEvent}>
      <UserShareList
        event={currentEvent}
        users={users}
        currentUserId={currentUserId}
      />
    </EventPageTemplate>
  );
}
