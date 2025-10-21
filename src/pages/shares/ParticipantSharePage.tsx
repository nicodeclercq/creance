import { EventNotFoundPage } from "../event/private/EventNotFoundPage";
import { EventParticipantNotFoundPage } from "../participants/private/EventParticipantNotFoundPage";
import { EventParticipantShareForm } from "../participants/private/EventParticipantShareForm";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import type { ParticipantShare } from "../../models/ParticipantShare";
import { Redirect } from "../../Redirect";
import { useData } from "../../store/useData";
import { useEventParticipants } from "../../hooks/useEventParticipants";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useTranslation } from "react-i18next";

export function ParticipantSharePage() {
  const { t } = useTranslation();
  const { goTo } = useRoute();
  const { eventId, participantId } = useParams();
  const [currentEvent, setEvent] = useData(`events.${eventId}`);
  const participants = useEventParticipants(eventId);

  if (!eventId || !currentEvent) {
    return <EventNotFoundPage />;
  }

  const currentParticipant = participants[participantId ?? ""];

  if (!participantId || !currentParticipant) {
    return <EventParticipantNotFoundPage eventId={currentEvent._id} />;
  }

  if (currentEvent.isClosed) {
    return <Redirect to="EVENT" params={{ eventId: currentEvent._id }} />;
  }

  const share = currentEvent.participants[participantId].participantShare;

  const saveShare = (data: ParticipantShare) => {
    setEvent((event) => ({
      ...event,
      participants: {
        ...event.participants,
        [participantId]: {
          ...event.participants[participantId],
          participantShare: data,
        },
      },
    }));
    goTo("EVENT_USERS", { eventId: currentEvent._id });
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
        to: "EVENT_USERS",
        params: { eventId: currentEvent._id },
      }}
    >
      <EventParticipantShareForm
        event={currentEvent}
        participant={currentParticipant}
        defaultValues={share}
        submitLabel={t("page.share.form.actions.submit")}
        onSubmit={saveShare}
        cancel={{
          label: t("page.share.form.actions.cancel"),
          onClick: () => goTo("EVENT_USERS", { eventId: currentEvent._id }),
        }}
      />
    </PageTemplate>
  );
}
