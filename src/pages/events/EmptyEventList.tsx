import { EmptyState } from "../../ui/EmptyState/EmptyState";
import { useTranslation } from "react-i18next";

export function EmptyEventList() {
  const { t } = useTranslation();

  return (
    <EmptyState
      title={t("page.events.empty.title")}
      description={t("page.events.empty.description")}
      illustration="card-out-of-stack"
      action={{
        label: t("page.events.empty.actions.create"),
        as: "link",
        to: "EVENT_ADD",
        icon: {
          name: "add",
          position: "start",
        },
      }}
    />
  );
}
