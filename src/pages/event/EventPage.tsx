import { EventNotFoundPage } from "./private/EventNotFoundPage";
import { ExpenseList } from "./private/ExpenseList";
import { removeFromObject } from "../../helpers/object";
import { useEventUsers } from "../../hooks/useEventUsers";
import { useParams } from "react-router";
import { useStore } from "../../store/StoreProvider";

export function EventPage() {
  const { eventId } = useParams();
  const [currentEvent, setEvent] = useStore(`events.${eventId}`);
  const [expenses, setExpenses] = useStore("expenses");
  const [deposits] = useStore("deposits");

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
      expenses: event.expenses.filter((expense) => expense !== expenseId),
    }));
    setExpenses((expenses) => removeFromObject(expenses, expenseId));
  };

  return (
    <ExpenseList
      event={currentEvent}
      expenses={expenses}
      deposits={deposits}
      users={users}
      onDeleteExpense={deleteExpense}
    />
  );
}
