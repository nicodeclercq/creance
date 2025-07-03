import { Card } from "../../ui/Card/Card";
import { Deposit } from "../../models/Deposit";
import { DepositForm } from "./private/DepositForm";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Paragraph } from "../../ui/Paragraph/Paragraph";
import { ROUTES } from "../../routes";
import { Stack } from "../../ui/Stack/Stack";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useStore } from "../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export function EditDepositPage() {
  const { t } = useTranslation();
  const { goTo } = useRoute();
  const { eventId, depositId } = useParams();
  const [event, setEvent] = useStore(`events.${eventId}`);

  const defaultValue = event.deposits[depositId!];

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
    <PageTemplate title={t("page.editDeposit.title")}>
      <Card>
        <Stack>
          <Paragraph>{t("page.editDeposit.description")}</Paragraph>
          <DepositForm
            onCancel={() => goTo(ROUTES.EVENT, { eventId: event._id })}
            cancelLabel={t("page.editDeposit.actions.cancel")}
            defaultValue={defaultValue}
            onSubmit={submit}
            submitLabel={t("page.editDeposit.actions.submit")}
            event={event}
            participants={event.participants}
          />
        </Stack>
      </Card>
    </PageTemplate>
  );
}
