import { Card } from "../../ui/Card/Card";
import { EventNotFoundPage } from "./private/EventNotFoundPage";
import { Expense } from "../../models/Expense";
import { ExpenseForm } from "./private/ExpenseForm";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { ROUTES } from "../../routes";
import { Redirect } from "../../Redirect";
import { fromExpense } from "./private/formExpense";
import { useEventUsers } from "../../hooks/useEventUsers";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useStore } from "../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export function EditExpensePage() {
  const { t } = useTranslation();
  const { eventId, expenseId } = useParams();
  const { goTo } = useRoute();
  const [events, setEvents] = useStore("events");
  const users = useEventUsers(eventId);

  if (!eventId) {
    return <EventNotFoundPage />;
  }

  const currentEvent = events[eventId];

  if (!currentEvent) {
    return <EventNotFoundPage />;
  }

  if (currentEvent.isClosed) {
    return <Redirect to="EVENT" params={{ eventId: currentEvent._id }} />;
  }

  if (!expenseId || !currentEvent.receivables[expenseId]) {
    return <>Expense not found</>;
  }

  const defaultValues = fromExpense(currentEvent.receivables[expenseId], users);

  const editExpense = (expense: Expense) => {
    setEvents((events) => ({
      ...events,
      [currentEvent._id]: {
        ...currentEvent,
        receivables: {
          ...currentEvent.receivables,
          [expenseId]: expense,
        },
      },
    }));
    goTo(ROUTES.EVENT, { eventId: currentEvent._id });
  };

  return (
    <PageTemplate
      title={t("page.event.edit.title")}
      leftAction={{
        as: "link",
        to: "EVENT",
        label: t("page.event.edit.actions.backToEvent"),
        icon: "chevron-left",
      }}
    >
      <Card>
        <ExpenseForm
          event={currentEvent}
          users={users}
          defaultValues={defaultValues}
          submitLabel={t("page.event.edit.form.actions.submit")}
          onSubmit={editExpense}
          cancel={{
            as: "link",
            label: t("page.event.add.form.actions.cancel"),
            to: "EVENT",
            params: { eventId: currentEvent._id },
          }}
        />
      </Card>
    </PageTemplate>
  );
}
