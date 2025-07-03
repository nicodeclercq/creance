import { EventNotFoundPage } from "../event/private/EventNotFoundPage";
import { EventPageTemplate } from "../../shared/PageTemplate/EventPageTemplate";
import { ParticipantShareList } from "./private/ParticipantShareList";
import { Redirect } from "../../Redirect";
import { ShareItem } from "./private/ShareItem";
import { useParams } from "react-router-dom";
import { useStore } from "../../store/StoreProvider";

export function SharesPage() {
  const { eventId } = useParams();
  const [currentEvent, setEvent] = useStore(`events.${eventId}`);
  const [currentParticipantId] = useStore("currentParticipantId");

  if (!eventId || !currentEvent) {
    return <EventNotFoundPage />;
  }

  const deleteShare = (participantId: string) => {
    setEvent((event) => ({
      ...event,
      participants: {
        ...event.participants,
        [participantId]: {
          ...event.participants[participantId],
          participantShare: { type: "default" },
        },
      },
    }));
  };

  if (currentEvent.isClosed) {
    return <Redirect to="EVENT" params={{ eventId: currentEvent._id }} />;
  }

  const shares = Object.keys(currentEvent.participants).map((participantId) => (
    <ShareItem
      key={participantId}
      eventId={currentEvent._id}
      participant={currentEvent.participants[participantId]}
      share={currentEvent.participants[participantId].participantShare}
      onDelete={() => deleteShare(participantId)}
    />
  ));

  return (
    <EventPageTemplate event={currentEvent}>
      <ParticipantShareList
        event={currentEvent}
        participants={currentEvent.participants}
        currentParticipantId={currentParticipantId}
      />
      {shares}
    </EventPageTemplate>
  );
}
