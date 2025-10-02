import { Participant } from "../models/Participant";
import { useData } from "../store/useData";

export function useEventParticipants(
  eventId: string | undefined
): Record<string, Participant> {
  const [event] = useData(`events.${eventId}`);

  if (!eventId) {
    return {};
  }

  if (!event) {
    return {};
  }

  return event.participants || {};
}
