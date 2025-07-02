import { EventNotFoundPage } from "./private/EventNotFoundPage";
import { ExpenseList } from "./private/ExpenseList";
import { removeFromObject } from "../../helpers/object";
import { useEventUsers } from "../../hooks/useEventUsers";
import { useParams } from "react-router";
import { useStore } from "../../store/StoreProvider";

export function EventPage() {
  const { eventId } = useParams();
  const [currentEvent, setEvent] = useStore(`events.${eventId}`);

  if (!eventId) {
    return <EventNotFoundPage />;
  }
  const users = useEventUsers(eventId);

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
      users={users}
      onDeleteExpense={deleteExpense}
      onDeleteDeposit={deleteDeposit}
    />
  );
}
