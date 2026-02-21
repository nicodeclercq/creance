import type { Event } from "../../../models/Event";
import { EventParticipantItem } from "./EventParticipantItem";
import { Stack } from "../../../ui/Stack/Stack";

type EventParticipantsListProps = {
  deleteShare: (participantId: string) => void;
  currentEvent: Event;
};

export function EventParticipantsList({
  currentEvent,
  deleteShare,
}: EventParticipantsListProps) {
  return (
    <Stack gap="m">
      {Object.keys(currentEvent.participants.collection).map((participantId) => (
        <EventParticipantItem
          key={participantId}
          eventId={currentEvent._id}
          participant={currentEvent.participants.collection[participantId]}
          share={currentEvent.participants.collection[participantId].participantShare}
          onDelete={() => deleteShare(participantId)}
        />
      ))}
    </Stack>
  );
}
