import { Card } from "../../ui/Card/Card";
import { EventNotFoundPage } from "./private/EventNotFoundPage";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { ROUTES } from "../../routes";
import { Redirect } from "../../Redirect";
import { Stack } from "../../ui/Stack/Stack";
import { Transaction } from "../../models/Transaction";
import { TransactionForm } from "./private/TransactionForm";
import { uid } from "../../service/crypto";
import { useData } from "../../store/useData";
import { useEventParticipants } from "../../hooks/useEventParticipants";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useTranslation } from "react-i18next";

export function AddTransactionPage() {
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
  const firstParticipant = Object.values(participants)[0];

  const handleSubmit = (transaction: Transaction) => {
    if (transaction.type === "expense") {
      setEvent((event) => ({
        ...event,
        expenses: {
          ...event.expenses,
          [transaction.data._id]: transaction.data,
        },
      }));
    } else {
      setEvent((event) => ({
        ...event,
        deposits: {
          ...event.deposits,
          [transaction.data._id]: transaction.data,
        },
      }));
    }
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
          <TransactionForm
            event={currentEvent}
            participants={participants}
            defaultValues={{
              type: "expense",
              data: {
                _id: uid(),
                reason: "",
                category: defaultCategory._id,
                lender: currentParticipant?._id || firstParticipant?._id || "",
                amount: "0",
                date: new Date(),
                share: { type: "default" },
                updatedAt: new Date(),
              },
            }}
            submitLabel={t("page.event.add.form.actions.submit")}
            onSubmit={handleSubmit}
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
