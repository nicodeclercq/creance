import { Avatar } from "../../../ui/Avatar/Avatar";
import { CalendarDate } from "../../../ui/CalendarDate/CalendarDate";
import { Category } from "../../../models/Category";
import { CategoryIcon } from "../../../ui/CategoryIcon/CategoryIcon";
import { Columns } from "../../../ui/Columns/Columns";
import { Expense } from "../../../models/Expense";
import { Menu } from "../../../ui/Menu/Menu";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Participant } from "../../../models/Participant";
import { Price } from "../../../ui/Price/Price";
import { Stack } from "../../../ui/Stack/Stack";
import { useTranslation } from "react-i18next";

type ExpenseItemProps = {
  eventId: string;
  isClosed?: boolean;
  expense: Expense;
  participants: Record<string, Participant>;
  category: Category;
  onDelete: () => void;
};

export function ExpenseItem({
  eventId,
  expense,
  participants,
  category,
  isClosed,
  onDelete,
}: ExpenseItemProps) {
  const { t } = useTranslation();

  const lender = participants[expense.lender];

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
      <CategoryIcon name={category.icon} label={category.name} />
      <Stack>
        <Price>{expense.amount}</Price>
        <Columns align="center" gap="s">
          <Avatar label={lender.name} size="s" />
          <Paragraph styles={{ font: "body-small" }}>{lender.name}</Paragraph>
        </Columns>
      </Stack>
      <CalendarDate date={expense.date} styles={{ font: "body-smaller" }} />
      {!isClosed && (
        <Menu
          label={t("page.event.expenseList.actions.more")}
          actions={[
            {
              as: "link",
              variant: "primary",
              icon: "edit",
              label: t("page.event.expenseList.actions.edit"),
              to: "EXPENSE_EDIT",
              params: { eventId, expenseId: expense._id },
            },
            {
              icon: "trash",
              label: t("page.event.expenseList.actions.delete"),
              onClick: onDelete,
              confirmation: {
                title: t(
                  "page.event.expenseList.actions.delete.confirmation.title"
                ),
                description: t(
                  "page.event.expenseList.actions.delete.confirmation.description"
                ),
                cancel: {
                  label: t(
                    "page.event.expenseList.actions.delete.confirmation.cancel"
                  ),
                },
                confirm: {
                  label: t(
                    "page.event.expenseList.actions.delete.confirmation.delete"
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
