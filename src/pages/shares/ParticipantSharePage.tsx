import { EventNotFoundPage } from "../event/private/EventNotFoundPage";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { ParticipantShare } from "../../models/ParticipantShare";
import { Redirect } from "../../Redirect";
import { ShareForm } from "./private/ShareForm";
import { ShareNotFoundPage } from "./private/ShareNotFoundPage";
import { useEventParticipants } from "../../hooks/useEventParticipants";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useStore } from "../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export function ParticipantSharePage() {
  const { t } = useTranslation();
  const { goTo } = useRoute();
  const { eventId, shareId } = useParams();
  const [currentEvent, setEvent] = useStore(`events.${eventId}`);
  const participants = useEventParticipants(eventId);

  if (!eventId || !currentEvent) {
    return <EventNotFoundPage />;
  }

  const currentParticipant = participants[shareId ?? ""];

  if (!shareId || !currentParticipant) {
    return <ShareNotFoundPage eventId={currentEvent._id} />;
  }

  if (currentEvent.isClosed) {
    return <Redirect to="EVENT" params={{ eventId: currentEvent._id }} />;
  }

  const share = currentEvent.participants[shareId].participantShare;

  const saveShare = (data: ParticipantShare) => {
    setEvent((event) => ({
      ...event,
      participants: {
        ...event.participants,
        [shareId]: {
          ...event.participants[shareId],
          participantShare: data,
        },
      },
    }));
    goTo("SHARES", { eventId: currentEvent._id });
  };

  return (
    <PageTemplate
      title={t("page.share.edit.title", {
        participant: currentParticipant.name,
      })}
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
        participant={currentParticipant}
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
