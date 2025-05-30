import { Button } from "../../../ui/Button/Button";
import { Card } from "../../../ui/Card/Card";
import { EmptyEvent } from "../EmptyEvent";
import { Event } from "../../../models/Event";
import { EventPageTemplate } from "../../../shared/PageTemplate/EventPageTemplate";
import { ExpenseItem } from "./ExpenseItem";
import { Stack } from "../../../ui/Stack/Stack";
import { TotalAmount } from "./TotalAmount";
import { User } from "../../../models/User";
import { useTranslation } from "react-i18next";

type Props = {
  event: Event;
  users: Record<string, User>;
  onDeleteExpense: (expenseId: string) => void;
};

export function ExpenseList({ event, users, onDeleteExpense }: Props) {
  const { t } = useTranslation();
  const expenses = Object.values(event.receivables);

  const deleteExpense = (expenseId: string) => () => {
    onDeleteExpense(expenseId);
  };

  return (
    <EventPageTemplate event={event}>
      {expenses.length === 0 ? (
        <EmptyEvent event={event} />
      ) : (
        <Stack gap="m">
          <TotalAmount expenses={expenses} categories={event.categories} />
          <Card>
            <Stack gap="s" alignItems="stretch">
              <Stack as="ol" gap="none">
                {expenses.map((expense) => (
                  <ExpenseItem
                    key={expense._id}
                    isClosed={event.isClosed}
                    eventId={event._id}
                    expense={expense}
                    category={event.categories[expense.category]}
                    users={users}
                    onDelete={deleteExpense(expense._id)}
                  />
                ))}
              </Stack>
              {!event.isClosed && (
                <Button
                  label={t("page.event.list.actions.addExpense")}
                  as="link"
                  to="EXPENSE_ADD"
                  params={{ eventId: event._id }}
                  variant="primary"
                />
              )}
            </Stack>
          </Card>
        </Stack>
      )}
    </EventPageTemplate>
  );
}
