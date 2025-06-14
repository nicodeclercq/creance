import { User } from "../models/User";
import { useStore } from "../store/StoreProvider";

export function useEventUsers(
  eventId: string | undefined
): Record<string, User> {
  const [event] = useStore(`events.${eventId}`);
  const [users] = useStore("users");

  if (!eventId) {
    return {};
  }

  if (!event) {
    return {};
  }
  return event.participants.reduce(
    (acc, userId) => ({ ...acc, [userId]: users[userId] }),
    {} as Record<string, User>
  );
}
