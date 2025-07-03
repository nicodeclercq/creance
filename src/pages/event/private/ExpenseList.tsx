import { Button } from "../../../ui/Button/Button";
import { Card } from "../../../ui/Card/Card";
import { Deposit } from "../../../models/Deposit";
import { DepositItem } from "./DepositItem";
import { EmptyEvent } from "../EmptyEvent";
import { Event } from "../../../models/Event";
import { EventPageTemplate } from "../../../shared/PageTemplate/EventPageTemplate";
import { Expense } from "../../../models/Expense";
import { ExpenseItem } from "./ExpenseItem";
import { Participant } from "../../../models/Participant";
import { Stack } from "../../../ui/Stack/Stack";
import { TotalAmount } from "./TotalAmount";
import { sort } from "../../../utils/date";
import { useTranslation } from "react-i18next";

type Props = {
  event: Event;
  participants: Record<string, Participant>;
  onDeleteExpense: (expenseId: string) => void;
  onDeleteDeposit: (depositId: string) => void;
};

type ExpenseElement = { type: "expense"; data: Expense };
type DepositElement = { type: "deposit"; data: Deposit };
type Element = ExpenseElement | DepositElement;

const isExpenseElement = (element: Element): element is ExpenseElement =>
  element.type === "expense";

export function ExpenseList({
  event,
  participants,
  onDeleteExpense,
  onDeleteDeposit,
}: Props) {
  const { t } = useTranslation();
  const expenses = Object.values(event.expenses);

  const deposits = Object.values(event.deposits);

  const deleteExpense = (expenseId: string) => () => {
    onDeleteExpense(expenseId);
  };

  const deleteDeposit = (depositId: string) => () => {
    onDeleteDeposit(depositId);
  };

  const list = (
    [
      ...expenses.map((expense) => ({ type: "expense", data: expense })),
      ...deposits.map((deposit) => ({ type: "deposit", data: deposit })),
    ] as Element[]
  ).sort((a, b) => sort(a.data.date, b.data.date) * -1);

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
                {list.map((element) =>
                  isExpenseElement(element) ? (
                    <ExpenseItem
                      key={element.data._id}
                      isClosed={event.isClosed}
                      eventId={event._id}
                      expense={element.data}
                      category={event.categories[element.data.category]}
                      participants={participants}
                      onDelete={deleteExpense(element.data._id)}
                    />
                  ) : (
                    <DepositItem
                      key={element.data._id}
                      isClosed={event.isClosed}
                      eventId={event._id}
                      deposit={element.data}
                      participants={participants}
                      onDelete={deleteDeposit(element.data._id)}
                    />
                  )
                )}
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
