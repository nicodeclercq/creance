import { EventNotFoundPage } from "./private/EventNotFoundPage";
import { ExpenseList } from "./private/ExpenseList";
import { deleteMergeableCollectionItem } from "../../models/mergeable";
import { useData } from "../../store/useData";
import { useEventParticipants } from "../../hooks/useEventParticipants";
import { useParams } from "react-router";

export function EventPage() {
  const { eventId } = useParams();
  const [currentEvent, setEvent] = useData(`events.collection.${eventId}`);

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
      expenses: deleteMergeableCollectionItem(expenseId, event.expenses),
    }));
  };

  const deleteDeposit = (depositId: string) => {
    setEvent((event) => ({
      ...event,
      deposits: deleteMergeableCollectionItem(depositId, event.deposits),
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
