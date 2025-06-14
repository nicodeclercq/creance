import { Avatar } from "../../../ui/Avatar/Avatar";
import { Columns } from "../../../ui/Columns/Columns";
import { Event } from "../../../models/Event";
import { Menu } from "../../../ui/Menu/Menu";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Stack } from "../../../ui/Stack/Stack";
import { User } from "../../../models/User";
import { useTranslation } from "react-i18next";

type ShareItemProps = {
  eventId: string;
  share: Event["shares"][string];
  user: User;
  onDelete: () => void;
};

export function ShareItem({ user, share, onDelete, eventId }: ShareItemProps) {
  const { t } = useTranslation();

  return (
    <Columns align="center" gap="s" as="li" styles={{ flexGrow: true }}>
      <Avatar label={user.name} />
      <Stack>
        <Paragraph>{user.name}</Paragraph>
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
            to: "SHARES_EDIT",
            params: { eventId, shareId: user._id },
          },
          {
            icon: "trash",
            label: t("page.event.shares.actions.delete"),
            onClick: onDelete,
            confirmation: {
              title: t("page.event.shares.actions.delete.confirmation.title"),
              description: t(
                "page.event.shares.actions.delete.confirmation.description",
                { user: user.name }
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
