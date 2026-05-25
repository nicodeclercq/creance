import type { Event } from "../../../models/Event";
import { EventParticipantShareForm } from "../../participants/private/EventParticipantShareForm";
import { Header } from "../../../shared/PageTemplate/Header";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import type { Participant } from "../../../models/Participant";
import type { ParticipantShare } from "../../../models/ParticipantShare";
import { Stack } from "../../../ui/Stack/Stack";
import { useTranslation } from "react-i18next";

type Props = {
  event: Event;
  participantShare: ParticipantShare;
  participant: Participant;
  onPrevious: () => void;
  onNext: (participantShare: ParticipantShare) => void;
};

export function SetParticipantShare({
  event,
  onNext,
  onPrevious,
  participant,
  participantShare,
}: Props) {
  const { t } = useTranslation();

  return (
    <Stack gap="m">
      <Header title={t("SetParticipantShare.title")} />
      <Paragraph>{t("SetParticipantShare.description")}</Paragraph>
      <EventParticipantShareForm
        event={event}
        cancel={{
          label: t("SetParticipantShare.action.cancel.label"),
          onClick: onPrevious,
        }}
        onSubmit={onNext}
        participant={participant}
        submitLabel={t("SetParticipantShare.action.submit.label")}
        defaultValues={participantShare}
      />
    </Stack>
  );
}
