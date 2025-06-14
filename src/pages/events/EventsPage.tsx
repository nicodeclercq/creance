import { EventList } from "./EventList";
import { useStore } from "../../store/StoreProvider";

export function EventsPage() {
  const [events] = useStore("events");
  const [users] = useStore("users");

  return <EventList events={Object.values(events)} users={users} />;
}
