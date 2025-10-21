import { EmptyState } from "../../ui/EmptyState/EmptyState";
import type { Event } from "../../models/Event";
import { useTranslation } from "react-i18next";
type Props = {
  event: Event;
};

export function EmptyEvent({ event }: Props) {
  const { t } = useTranslation();

  return (
    <EmptyState
      title={t("page.event.empty.title")}
      description={t(
        event.isClosed
          ? "page.event.empty.description.closed"
          : "page.event.empty.description"
      )}
      illustration="empty-box"
      action={
        event.isClosed
          ? undefined
          : {
              as: "link",
              label: t("page.event.empty.actions.add"),
              to: "TRANSACTION_ADD",
              params: { eventId: event._id },
            }
      }
    />
  );
}
