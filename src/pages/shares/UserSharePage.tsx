import { EventNotFoundPage } from "../event/private/EventNotFoundPage";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Redirect } from "../../Redirect";
import { ShareForm } from "./private/ShareForm";
import { ShareNotFoundPage } from "./private/ShareNotFoundPage";
import { UserShare } from "../../models/Event";
import { useEventUsers } from "../../hooks/useEventUsers";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useStore } from "../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export function UserSharePage() {
  const { t } = useTranslation();
  const { goTo } = useRoute();
  const [events, setEvents] = useStore("events");
  const { eventId, shareId } = useParams();
  const users = useEventUsers(eventId);

  if (!eventId) {
    return <EventNotFoundPage />;
  }

  const currentEvent = events[eventId];
  const currentUser = users[shareId ?? ""];

  if (!currentEvent) {
    return <EventNotFoundPage />;
  }
  if (!shareId || !currentUser) {
    return <ShareNotFoundPage eventId={currentEvent._id} />;
  }

  if (currentEvent.isClosed) {
    return <Redirect to="EVENT" params={{ eventId: currentEvent._id }} />;
  }

  const share = currentEvent.shares[shareId];

  const saveShare = (data: UserShare) => {
    setEvents((events) => ({
      ...events,
      [eventId]: {
        ...currentEvent,
        shares: {
          ...currentEvent.shares,
          [shareId]: data,
        },
      },
    }));
    goTo("SHARES", { eventId: currentEvent._id });
  };

  return (
    <PageTemplate
      title={t("page.share.edit.title", { user: currentUser.name })}
      leftAction={{
        as: "link",
        icon: "chevron-left",
        label: t("page.event.share.edit.actions.backToShares"),
        to: "SHARES",
        params: { eventId: currentEvent._id },
      }}
    >
      <ShareForm
        event={currentEvent}
        user={currentUser}
        defaultValues={share}
        submitLabel={t("page.share.form.actions.submit")}
        onSubmit={saveShare}
        cancel={{
          label: t("page.share.form.actions.cancel"),
          onClick: () => goTo("SHARES", { eventId: currentEvent._id }),
        }}
      />
    </PageTemplate>
  );
}
