import { Participant } from "../models/Participant";
import { useStore } from "../store/StoreProvider";

export function useEventParticipants(
  eventId: string | undefined
): Record<string, Participant> {
  const [event] = useStore(`events.${eventId}`);

  if (!eventId) {
    return {};
  }

  if (!event) {
    return {};
  }

  return event.participants || {};
}
