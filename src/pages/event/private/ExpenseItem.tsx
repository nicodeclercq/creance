import { Avatar } from "../../../ui/Avatar/Avatar";
import { Category } from "../../../models/Category";
import { CategoryIcon } from "../../../ui/CategoryIcon/CategoryIcon";
import { Columns } from "../../../ui/Columns/Columns";
import { DateFormatter } from "../../../ui/DateFormatter/DateFormatter";
import { Expense } from "../../../models/Expense";
import { Menu } from "../../../ui/Menu/Menu";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Participant } from "../../../models/Participant";
import { Price } from "../../../ui/Price/Price";
import { Stack } from "../../../ui/Stack/Stack";
import { useCurrentUser } from "../../../store/useCurrentUser";
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
  const { isCurrentUser } = useCurrentUser();

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
          <Avatar
            label={
              isCurrentUser(lender)
                ? t("currentUser.anonymous.name")
                : lender.name
            }
            image={lender.avatar}
            size="s"
          />
          <Paragraph styles={{ font: "body-small" }}>
            {isCurrentUser(lender)
              ? t("currentUser.anonymous.name")
              : lender.name}
          </Paragraph>
        </Columns>
      </Stack>
      <Paragraph styles={{ font: "body-smaller" }}>
        <DateFormatter>{expense.date}</DateFormatter>
      </Paragraph>
      {!isClosed && (
        <Menu
          label={t("page.event.expenseList.actions.more")}
          actions={[
            {
              as: "link",
              variant: "primary",
              icon: "edit",
              label: t("page.event.expenseList.actions.edit"),
              to: "TRANSACTION_EDIT",
              params: { eventId, transactionId: expense._id },
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
