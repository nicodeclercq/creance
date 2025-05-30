import { NotFountPage } from "../../error/NotFountPage";
import { useTranslation } from "react-i18next";

export type ShareNotFoundPageProps = {
  eventId: string;
};

export function ShareNotFoundPage({ eventId }: ShareNotFoundPageProps) {
  const { t } = useTranslation();
  return (
    <NotFountPage
      title={t("page.event.share.notFound")}
      illustration="card-box"
      actions={[
        {
          as: "link",
          label: t("page.event.share.edit.actions.backToShares"),
          variant: "primary",
          to: "SHARES",
          params: { eventId },
        },
        {
          as: "link",
          label: t("page.event.edit.actions.backToEvent"),
          variant: "secondary",
          to: "EVENT",
          params: { eventId },
        },
      ]}
    />
  );
}
