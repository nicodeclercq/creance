import { Avatar } from "../../../ui/Avatar/Avatar";
import { Columns } from "../../../ui/Columns/Columns";
import { Menu } from "../../../ui/Menu/Menu";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Participant } from "../../../models/Participant";
import { ParticipantShare } from "../../../models/ParticipantShare";
import { Stack } from "../../../ui/Stack/Stack";
import { useCurrentUser } from "../../../store/useCurrentUser";
import { useTranslation } from "react-i18next";

type ShareItemProps = {
  eventId: string;
  share: ParticipantShare;
  participant: Participant;
  onDelete: () => void;
};

export function EventParticipantItem({
  participant,
  share,
  onDelete,
  eventId,
}: ShareItemProps) {
  const { t } = useTranslation();
  const { isCurrentUser } = useCurrentUser();

  return (
    <Columns align="center" gap="s" as="li" styles={{ flexGrow: true }}>
      <Avatar label={participant.name} image={participant.avatar} />
      <Stack>
        <Paragraph>
          {isCurrentUser(participant)
            ? t("currentUser.anonymous.name")
            : participant.name}
        </Paragraph>
        <Paragraph styles={{ font: "body-small" }}>
          {t("page.event.shares.type", {
            share: share.type,
          })}
        </Paragraph>
      </Stack>
      <Menu
        label={t("page.event.expenseList.actions.more")}
        actions={[
          {
            as: "link",
            variant: "primary",
            icon: "edit",
            label: t("page.event.shares.actions.edit"),
            to: "EVENT_USERS_EDIT",
            params: { eventId, participantId: participant._id },
          },
          {
            icon: "trash",
            label: t("page.event.shares.actions.delete"),
            onClick: onDelete,
            confirmation: {
              title: t("page.event.shares.actions.delete.confirmation.title"),
              description: t(
                "page.event.shares.actions.delete.confirmation.description",
                { participant: participant.name }
              ),
              cancel: {
                label: t(
                  "page.event.shares.actions.delete.confirmation.cancel"
                ),
              },
              confirm: {
                label: t(
                  "page.event.shares.actions.delete.confirmation.delete"
                ),
                onClick: onDelete,
              },
            },
          },
        ]}
      />
    </Columns>
  );
}
