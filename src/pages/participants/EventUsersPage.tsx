import { AddParticipantsForm } from "../events/private/AddParticipantsForm";
import { Button } from "../../ui/Button/Button";
import { Card } from "../../ui/Card/Card";
import { Columns } from "../../ui/Columns/Columns";
import { EventNotFoundPage } from "../event/private/EventNotFoundPage";
import { EventParticipantsList } from "./private/EventParticipantsList";
import { Modal } from "../../ui/Modal/Modal";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import type { Participant } from "../../models/Participant";
import { Redirect } from "../../Redirect";
import { Stack } from "../../ui/Stack/Stack";
import { useData } from "../../store/useData";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function EventUsersPage() {
  const { eventId } = useParams();
  const { t } = useTranslation();
  const [showAddParticipantForm, setShowAddParticipantForm] = useState(false);
  const [currentEvent, setEvent] = useData(`events.${eventId}`);

  if (!eventId || !currentEvent) {
    return <EventNotFoundPage />;
  }

  const addParticipant = (participant: Participant) => {
    setShowAddParticipantForm(false);
    setEvent((event) => ({
      ...event,
      participants: {
        ...event.participants,
        [participant._id]: participant,
      },
    }));
  };

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
      <Card>
        <Stack gap="m">
          <EventParticipantsList
            currentEvent={currentEvent}
            deleteShare={deleteShare}
          />
          <Columns justify="center">
            <Button
              label={t("page.event.edit.participants.actions.addParticipant")}
              onClick={() => {
                setShowAddParticipantForm(true);
              }}
              variant="secondary"
              icon={{ name: "add", position: "start" }}
            />
          </Columns>
        </Stack>
      </Card>
      {showAddParticipantForm && (
        <Modal
          title={t("page.event.edit.participants.actions.addParticipant")}
          isOpen={showAddParticipantForm}
        >
          <AddParticipantsForm
            onAdd={addParticipant}
            participants={Object.values(currentEvent.participants)}
          />
        </Modal>
      )}
    </PageTemplate>
  );
}
