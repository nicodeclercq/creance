import { Card } from "../../ui/Card/Card";
import type { Deposit } from "../../models/Deposit";
import { EventNotFoundPage } from "./private/EventNotFoundPage";
import type { Expense } from "../../models/Expense";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { ROUTES } from "../../routes";
import { Redirect } from "../../Redirect";
import type { Transaction } from "../../models/Transaction";
import { TransactionForm } from "./private/TransactionForm";
import { useData } from "../../store/useData";
import { useEventParticipants } from "../../hooks/useEventParticipants";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useTranslation } from "react-i18next";

export function EditTransactionPage() {
  const { t } = useTranslation();
  const { eventId, transactionId } = useParams();
  const { goTo } = useRoute();
  const [currentEvent, setEvent] = useData(`events.${eventId}`);
  const participants = useEventParticipants(eventId);

  if (!eventId || !currentEvent) {
    return <EventNotFoundPage />;
  }

  if (currentEvent.isClosed) {
    return <Redirect to="EVENT" params={{ eventId: currentEvent._id }} />;
  }

  if (!transactionId) {
    return <>Transaction not found</>;
  }

  // Try to find in expenses first, then deposits
  const currentExpense: Expense | undefined =
    currentEvent.expenses[transactionId];
  const currentDeposit: Deposit | undefined =
    currentEvent.deposits[transactionId];

  const isExpense = !!currentExpense;
  const isDeposit = !!currentDeposit;

  if (!isExpense && !isDeposit) {
    return <>Transaction not found</>;
  }

  // Get default values as Transaction type
  const defaultValues: Transaction =
    isExpense && currentExpense
      ? { type: "expense", data: currentExpense }
      : isDeposit && currentDeposit
      ? { type: "deposit", data: currentDeposit }
      : {
          type: "expense",
          data: {
            _id: "",
            reason: "",
            category: Object.values(currentEvent.categories)[0]?._id || "",
            lender: Object.values(participants)[0]?._id || "",
            amount: "0",
            date: new Date(),
            share: { type: "default" },
            updatedAt: new Date(),
          },
        };

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
      title={t("page.event.edit.title")}
      leftAction={{
        as: "link",
        to: "EVENT",
        label: t("page.event.edit.actions.backToEvent"),
        icon: "chevron-left",
        params: { eventId: currentEvent._id },
      }}
    >
      <Card>
        <TransactionForm
          event={currentEvent}
          participants={participants}
          defaultValues={defaultValues}
          submitLabel={t("page.event.edit.form.actions.submit")}
          onSubmit={handleSubmit}
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
