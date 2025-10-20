import { Card } from "../../ui/Card/Card";
import { Columns } from "../../ui/Columns/Columns";
import { ContextualMenu } from "../../ui/ContextualMenu/ContextualMenu";
import { EventNotFoundPage } from "./private/EventNotFoundPage";
import { Expense } from "../../models/Expense";
import { ExpenseForm } from "./private/ExpenseForm";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { ROUTES } from "../../routes";
import { Redirect } from "../../Redirect";
import { Stack } from "../../ui/Stack/Stack";
import { uid } from "../../service/crypto";
import { useData } from "../../store/useData";
import { useEventParticipants } from "../../hooks/useEventParticipants";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useTranslation } from "react-i18next";

export function AddExpensePage() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const { goTo } = useRoute();
  const [currentEvent, setEvent] = useData(`events.${eventId}`);
  const participants = useEventParticipants(eventId);
  const [currentParticipantId] = useData(`account.events.${eventId}.uid`);

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
        params: { eventId: currentEvent._id },
      }}
    >
      <Card>
        <Stack gap="m">
          <Columns justify="center">
            <ContextualMenu
              currentAction="expense"
              actions={{
                expense: {
                  label: t("AddExpensePage.menu.expense"),
                  onClick: () =>
                    goTo(ROUTES.EXPENSE_ADD, { eventId: currentEvent._id }),
                },
                deposit: {
                  label: t("AddExpensePage.menu.deposit"),
                  onClick: () =>
                    goTo(ROUTES.DEPOSIT_ADD, { eventId: currentEvent._id }),
                },
              }}
            />
          </Columns>
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
        </Stack>
      </Card>
    </PageTemplate>
  );
}
