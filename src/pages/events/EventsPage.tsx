import { EventList } from "./EventList";
import { getAllEvents } from "../../service/firebase";
import { useStore } from "../../store/StoreProvider";

export function EventsPage() {
  const [events] = useStore("events");
  const [users] = useStore("users");

  getAllEvents().then((d) => {
    console.log("Fetched events:", d);
  });

  return <EventList events={Object.values(events)} users={users} />;
}
