import { Card } from "../../ui/Card/Card";
import { Columns } from "../../ui/Columns/Columns";
import { ContextualMenu } from "../../ui/ContextualMenu/ContextualMenu";
import { Deposit } from "../../models/Deposit";
import { DepositForm } from "./private/DepositForm";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { ROUTES } from "../../routes";
import { Stack } from "../../ui/Stack/Stack";
import { uid } from "../../service/crypto";
import { useData } from "../../store/useData";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useTranslation } from "react-i18next";

export function AddDepositPage() {
  const { t } = useTranslation();
  const { goTo } = useRoute();
  const { eventId } = useParams();
  const [event, setEvent] = useData(`events.${eventId}`);

  const defaultValue: Deposit = {
    _id: uid(),
    amount: "0",
    from: "",
    to: "",
    date: new Date(),
    updatedAt: new Date(),
    note: "",
  };

  const submit = (deposit: Deposit) => {
    setEvent((currentEvent) => ({
      ...currentEvent,
      deposits: {
        ...currentEvent.deposits,
        [deposit._id]: deposit,
      },
    }));
    goTo(ROUTES.EVENT, { eventId: event._id });
  };

  return (
    <PageTemplate
      title={t("page.addDeposit.title")}
      leftAction={{
        as: "link",
        to: "EVENT",
        label: t("page.event.add.actions.backToList"),
        icon: "chevron-left",
        params: { eventId: event._id },
      }}
    >
      <Card>
        <Stack gap="m">
          <Columns justify="center">
            <ContextualMenu
              currentAction="deposit"
              actions={{
                expense: {
                  label: t("AddExpensePage.menu.expense"),
                  onClick: () =>
                    goTo(ROUTES.EXPENSE_ADD, { eventId: event._id }),
                },
                deposit: {
                  label: t("AddExpensePage.menu.deposit"),
                  onClick: () =>
                    goTo(ROUTES.DEPOSIT_ADD, { eventId: event._id }),
                },
              }}
            />
          </Columns>
          <Paragraph>{t("page.addDeposit.description")}</Paragraph>
          <DepositForm
            event={event}
            participants={event.participants}
            defaultValue={defaultValue}
            onSubmit={submit}
            submitLabel={t("page.addDeposit.actions.submit")}
            cancelLabel={t("page.addDeposit.actions.cancel")}
            onCancel={() => goTo(ROUTES.EVENT, { eventId: event._id })}
          />
        </Stack>
      </Card>
    </PageTemplate>
  );
}
