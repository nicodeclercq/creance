import { EventNotFoundPage } from "./private/EventNotFoundPage";
import { ExpenseList } from "./private/ExpenseList";
import { removeFromObject } from "../../helpers/object";
import { useEventParticipants } from "../../hooks/useEventParticipants";
import { useParams } from "react-router";
import { useStore } from "../../store/StoreProvider";

export function EventPage() {
  const { eventId } = useParams();
  const [currentEvent, setEvent] = useStore(`events.${eventId}`);

  if (!eventId) {
    return <EventNotFoundPage />;
  }
  const participants = useEventParticipants(eventId);

  if (!currentEvent) {
    return <EventNotFoundPage />;
  }

  const deleteExpense = (expenseId: string) => {
    setEvent((event) => ({
      ...event,
      expenses: removeFromObject(event.expenses, expenseId),
    }));
  };

  const deleteDeposit = (depositId: string) => {
    setEvent((event) => ({
      ...event,
      deposits: removeFromObject(event.deposits, depositId),
    }));
  };

  return (
    <ExpenseList
      event={currentEvent}
      participants={participants}
      onDeleteExpense={deleteExpense}
      onDeleteDeposit={deleteDeposit}
    />
  );
}
