import { Avatar } from "../../../ui/Avatar/Avatar";
import { AvatarGroup } from "../../../ui/AvatarGroup/AvatarGroup";
import { Columns } from "../../../ui/Columns/Columns";
import { Event } from "../../../models/Event";
import { IconButton } from "../../../ui/IconButton/IconButton";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Participant } from "../../../models/Participant";
import { Stack } from "../../../ui/Stack/Stack";
import { useTranslation } from "react-i18next";

type EventItemProps = {
  event: Event;
  participants: Record<string, Participant>;
};

export function EventItem({
  event: { name, _id, participants: eventParticipants, isClosed = false },
  participants,
}: EventItemProps) {
  const { t } = useTranslation();
  const eventParticipantIds = Object.keys(eventParticipants);

  return (
    <Columns
      as="li"
      align="center"
      gap="m"
      template={["max-content", "1fr", "max-content"]}
      styles={{
        position: "relative",
        padding: "m",
        radius: "s",
        overflow: "hidden",
      }}
    >
      <Avatar label={name} statusIcon={isClosed ? "lock" : undefined} />
      <Stack>
        <Paragraph styles={{ flexGrow: true }}>
          {name} {isClosed && t("page.events.list.closed")}
        </Paragraph>
        <Columns gap="s" align="center">
          <AvatarGroup
            size="s"
            avatars={eventParticipantIds.map((participantId) => ({
              label: participants[participantId].name,
            }))}
          />
        </Columns>
      </Stack>
      <IconButton
        as="link"
        overlays
        variant="tertiary"
        icon="chevron-right"
        label={t("page.events.actions.view")}
        to="EVENT"
        params={{ eventId: _id }}
      />
    </Columns>
  );
}
