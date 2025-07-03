import { EmptyEvent } from "../event/EmptyEvent";
import { EventNotFoundPage } from "../event/private/EventNotFoundPage";
import { EventPageTemplate } from "../../shared/PageTemplate/EventPageTemplate";
import { ParticipantShareList } from "./private/ParticipantShareList";
import { useEventParticipants } from "../../hooks/useEventParticipants";
import { useParams } from "react-router-dom";
import { useStore } from "../../store/StoreProvider";

export function EventParticipantSharePage() {
  const { eventId } = useParams();
  const [currentEvent] = useStore(`events.${eventId}`);
  const [currentParticipantId] = useStore("currentParticipantId");
  const participants = useEventParticipants(eventId);

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
      <ParticipantShareList
        event={currentEvent}
        participants={participants}
        currentParticipantId={currentParticipantId}
      />
    </EventPageTemplate>
  );
}
