import { AvatarGroup } from "../../../ui/AvatarGroup/AvatarGroup";
import { CalendarDate } from "../../../ui/CalendarDate/CalendarDate";
import { Columns } from "../../../ui/Columns/Columns";
import { Deposit } from "../../../models/Deposit";
import { ExchangeMoneyIcon } from "../../../ui/Icon/private/ExchangeMoneyIcon";
import { Menu } from "../../../ui/Menu/Menu";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Participant } from "../../../models/Participant";
import { Price } from "../../../ui/Price/Price";
import { Stack } from "../../../ui/Stack/Stack";
import { computeRandomColor } from "../../../ui/Avatar/Avatar";
import { useTranslation } from "react-i18next";

type DepositItemProps = {
  eventId: string;
  isClosed?: boolean;
  deposit: Deposit;
  participants: Record<string, Participant>;
  onDelete: () => void;
};

export function DepositItem({
  eventId,
  deposit,
  participants,
  isClosed,
  onDelete,
}: DepositItemProps) {
  const { t } = useTranslation();

  const from = participants[deposit.from];
  const to = participants[deposit.to];

  return (
    <Columns
      as="li"
      align="center"
      gap="m"
      template={["max-content", "1fr", "max-content", "max-content"]}
      styles={{
        position: "relative",
        padding: "m",
        radius: "s",
        overflow: "hidden",
      }}
    >
      <span
        style={{ fontSize: "3.2rem", color: computeRandomColor("deposit") }}
      >
        <ExchangeMoneyIcon strokeWidth={0.5} />
      </span>
      <Stack>
        <Price styles={{ font: "body-small" }}>{deposit.amount}</Price>
        <Columns align="center" gap="s">
          <AvatarGroup
            avatars={[{ label: from.name }, { label: to.name }]}
            size="s"
          />
          <Paragraph styles={{ font: "body-small" }}>
            {t("page.event.depositItem.participants", {
              from: from.name,
              to: to.name,
            })}
          </Paragraph>
        </Columns>
      </Stack>
      <CalendarDate date={deposit.date} styles={{ font: "body-smaller" }} />
      {!isClosed && (
        <Menu
          label={t("page.event.expenseList.actions.more")}
          actions={[
            {
              as: "link",
              variant: "primary",
              icon: "edit",
              label: t("page.event.depositItem.actions.edit"),
              to: "DEPOSIT_EDIT",
              params: { eventId, depositId: deposit._id },
            },
            {
              icon: "trash",
              label: t("page.event.depositItem.actions.delete"),
              onClick: onDelete,
              confirmation: {
                title: t(
                  "page.event.depositItem.actions.delete.confirmation.title"
                ),
                description: t(
                  "page.event.depositItem.actions.delete.confirmation.description",
                  { from: from.name, amount: deposit.amount, to: to.name }
                ),
                cancel: {
                  label: t(
                    "page.event.expenseList.actions.delete.confirmation.cancel"
                  ),
                },
                confirm: {
                  label: t(
                    "page.event.depositItem.actions.delete.confirmation.submit"
                  ),
                  onClick: onDelete,
                },
              },
            },
          ]}
        />
      )}
    </Columns>
  );
}
