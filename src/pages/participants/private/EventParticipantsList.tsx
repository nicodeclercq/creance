import { Card } from "../../../ui/Card/Card";
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
    <Card>
      <Stack gap="m">
        {Object.keys(currentEvent.participants).map((participantId) => (
          <EventParticipantItem
            key={participantId}
            eventId={currentEvent._id}
            participant={currentEvent.participants[participantId]}
            share={currentEvent.participants[participantId].participantShare}
            onDelete={() => deleteShare(participantId)}
          />
        ))}
      </Stack>
    </Card>
  );
}
