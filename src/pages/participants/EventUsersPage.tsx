import { EventNotFoundPage } from "../event/private/EventNotFoundPage";
import { EventParticipantsList } from "./private/EventParticipantsList";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { Redirect } from "../../Redirect";
import { useParams } from "react-router-dom";
import { useData } from "../../store/useData";
import { useTranslation } from "react-i18next";

export function EventUsersPage() {
  const { eventId } = useParams();
  const { t } = useTranslation();
  const [currentEvent, setEvent] = useData(`events.${eventId}`);

  if (!eventId || !currentEvent) {
    return <EventNotFoundPage />;
  }

  const deleteShare = (participantId: string) => {
    setEvent((event) => ({
      ...event,
      participants: {
        ...event.participants,
        [participantId]: {
          ...event.participants[participantId],
          participantShare: { type: "default" },
        },
      },
    }));
  };

  if (currentEvent.isClosed) {
    return <Redirect to="EVENT" params={{ eventId: currentEvent._id }} />;
  }

  return (
    <PageTemplate
      title={t("page.event.edit.participants.title")}
      leftAction={{
        as: "link",
        to: "EVENT",
        label: t("page.event.add.actions.backToList"),
        icon: "chevron-left",
        params: { eventId: currentEvent._id },
      }}
    >
      <EventParticipantsList
        currentEvent={currentEvent}
        deleteShare={deleteShare}
      />
    </PageTemplate>
  );
}
