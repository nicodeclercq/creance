import { NotFountPage } from "../../error/NotFountPage";
import { useTranslation } from "react-i18next";

export function EventNotFoundPage() {
  const { t } = useTranslation();
  return (
    <NotFountPage
      title={t("page.event.notFound.title")}
      actions={[
        {
          as: "link",
          label: t("page.event.notFound.actions.backToList"),
          variant: "primary",
          to: "EVENT_LIST",
        },
        {
          as: "link",
          label: t("page.event.notFound.actions.createNew"),
          variant: "secondary",
          to: "EVENT_ADD",
        },
      ]}
    />
  );
}
