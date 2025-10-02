import { Card } from "../../ui/Card/Card";
import { Deposit } from "../../models/Deposit";
import { DepositForm } from "./private/DepositForm";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { ROUTES } from "../../routes";
import { Stack } from "../../ui/Stack/Stack";
import { uid } from "../../service/crypto";
import { useParams } from "react-router-dom";
import { useData } from "../../store/useData";
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
    <PageTemplate title={t("page.addDeposit.title")}>
      <Card>
        <Stack>
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
