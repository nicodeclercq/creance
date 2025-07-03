import { Card } from "../../ui/Card/Card";
import { EventNotFoundPage } from "./private/EventNotFoundPage";
import { Expense } from "../../models/Expense";
import { ExpenseForm } from "./private/ExpenseForm";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { ROUTES } from "../../routes";
import { Redirect } from "../../Redirect";
import { uid } from "../../service/crypto";
import { useEventParticipants } from "../../hooks/useEventParticipants";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useStore } from "../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export function AddExpensePage() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const { goTo } = useRoute();
  const [currentEvent, setEvent] = useStore(`events.${eventId}`);
  const participants = useEventParticipants(eventId);
  const [currentParticipantId] = useStore("currentParticipantId");

  if (!eventId || !currentEvent) {
    return <EventNotFoundPage />;
  }
  const currentParticipant = participants[currentParticipantId];

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
          participants={participants}
          defaultValues={{
            _id: uid(),
            reason: "",
            category: defaultCategory._id,
            lender: currentParticipant._id,
            amount: "0",
            date: new Date(),
            share: {
              type: "default" as const,
              percentageParticipant: Object.keys(participants).reduce(
                (acc, participant) => ({ ...acc, [participant]: "0" }),
                {} as Record<string, string>
              ),
              fixedParticipant: Object.keys(participants).reduce(
                (acc, participant) => ({ ...acc, [participant]: "0" }),
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
