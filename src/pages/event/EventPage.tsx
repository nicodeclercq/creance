import { EventNotFoundPage } from "./private/EventNotFoundPage";
import { ExpenseList } from "./private/ExpenseList";
import { removeFromObject } from "../../helpers/object";
import { useEventUsers } from "../../hooks/useEventUsers";
import { useParams } from "react-router";
import { useStore } from "../../store/StoreProvider";

export function EventPage() {
  const { eventId } = useParams();
  const [events, setEvents] = useStore("events");

  if (!eventId) {
    return <EventNotFoundPage />;
  }
  const currentEvent = events[eventId];
  const users = useEventUsers(eventId);

  if (!currentEvent) {
    return <EventNotFoundPage />;
  }

  const deleteExpense = (expenseId: string) => {
    setEvents((events) => ({
      ...events,
      [currentEvent._id]: {
        ...currentEvent,
        receivables: removeFromObject(currentEvent.receivables, expenseId),
      },
    }));
  };

  return (
    <ExpenseList
      event={currentEvent}
      users={users}
      onDeleteExpense={deleteExpense}
    />
  );
}
