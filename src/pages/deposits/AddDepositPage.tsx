import { Card } from "../../ui/Card/Card";
import { Deposit } from "../../models/Deposit";
import { DepositForm } from "./private/DepositForm";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { ROUTES } from "../../routes";
import { Stack } from "../../ui/Stack/Stack";
import { uid } from "../../uid";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useStore } from "../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export function AddDepositPage() {
  const { t } = useTranslation();
  const { goTo } = useRoute();
  const { eventId } = useParams();
  const [event, setEvent] = useStore(`events.${eventId}`);
  const [_, setDeposits] = useStore(`deposits`);
  const [users] = useStore("users");

  const defaultValue: Deposit = {
    _id: uid(),
    amount: "0",
    from: "",
    to: "",
    updatedAt: new Date(),
    createdAt: new Date(),
    note: "",
  };

  const submit = (deposit: Deposit) => {
    setEvent((currentEvent) => ({
      ...currentEvent,
      deposits: [...currentEvent.deposits, deposit._id],
    }));
    setDeposits((deposits) => ({ ...deposits, [deposit._id]: deposit }));
    goTo(ROUTES.EVENT, { eventId: event._id });
  };

  return (
    <PageTemplate title={t("page.addDeposit.title")}>
      <Card>
        <Stack>
          <Paragraph>{t("page.addDeposit.description")}</Paragraph>
          <DepositForm
            onCancel={() => goTo(ROUTES.EVENT, { eventId: event._id })}
            cancelLabel={t("page.addDeposit.actions.cancel")}
            defaultValue={defaultValue}
            onSubmit={submit}
            submitLabel={t("page.addDeposit.actions.submit")}
            event={event}
            users={users}
          />
        </Stack>
      </Card>
    </PageTemplate>
  );
}
