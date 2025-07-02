import { Card } from "../../ui/Card/Card";
import { EventNotFoundPage } from "./private/EventNotFoundPage";
import { Expense } from "../../models/Expense";
import { ExpenseForm } from "./private/ExpenseForm";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { ROUTES } from "../../routes";
import { Redirect } from "../../Redirect";
import { uid } from "../../service/crypto";
import { useEventUsers } from "../../hooks/useEventUsers";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useStore } from "../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export function AddExpensePage() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const { goTo } = useRoute();
  const [currentEvent, setEvent] = useStore(`events.${eventId}`);
  const users = useEventUsers(eventId);
  const [currentUserId] = useStore("currentUserId");

  if (!eventId || !currentEvent) {
    return <EventNotFoundPage />;
  }
  const currentUser = users[currentUserId];

  if (currentEvent.isClosed) {
    return <Redirect to="EVENT" params={{ eventId: currentEvent._id }} />;
  }

  const defaultCategory = Object.values(currentEvent.categories)[0];

  const addExpense = (expense: Expense) => {
    setEvent((event) => ({
      ...event,
      expenses: {
        ...event.expenses,
        [expense._id]: expense,
      },
    }));
    goTo(ROUTES.EVENT, { eventId: currentEvent._id });
  };

  return (
    <PageTemplate
      title={t("page.event.add.title")}
      leftAction={{
        as: "link",
        to: "EVENT",
        label: t("page.event.add.actions.backToList"),
        icon: "chevron-left",
      }}
    >
      <Card>
        <ExpenseForm
          event={currentEvent}
          users={users}
          defaultValues={{
            _id: uid(),
            reason: "",
            category: defaultCategory._id,
            lender: currentUser._id,
            amount: "0",
            date: new Date(),
            share: {
              type: "default" as const,
              percentageUser: Object.keys(users).reduce(
                (acc, user) => ({ ...acc, [user]: "0" }),
                {} as Record<string, string>
              ),
              fixedUser: Object.keys(users).reduce(
                (acc, user) => ({ ...acc, [user]: "0" }),
                {} as Record<string, string>
              ),
            },
            updatedAt: new Date(),
          }}
          submitLabel={t("page.event.add.form.actions.submit")}
          onSubmit={addExpense}
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
