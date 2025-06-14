import { Avatar } from "../../../ui/Avatar/Avatar";
import { AvatarGroup } from "../../../ui/AvatarGroup/AvatarGroup";
import { Columns } from "../../../ui/Columns/Columns";
import { Event } from "../../../models/Event";
import { IconButton } from "../../../ui/IconButton/IconButton";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Stack } from "../../../ui/Stack/Stack";
import { User } from "../../../models/User";
import { useTranslation } from "react-i18next";

type EventItemProps = { event: Event; users: Record<string, User> };

export function EventItem({
  event: { name, _id, shares, isClosed = false },
  users,
}: EventItemProps) {
  const { t } = useTranslation();
  const eventUsers = Object.keys(shares);

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
          {name} {isClosed && t("page.events.list.closed")}
        </Paragraph>
        <Columns gap="s" align="center">
          <AvatarGroup
            size="s"
            avatars={eventUsers.map((userId) => ({
              label: users[userId].name,
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
