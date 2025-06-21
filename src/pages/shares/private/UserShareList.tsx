import * as Either from "fp-ts/Either";

import { Avatar, computeRandomColor } from "../../../ui/Avatar/Avatar";
import { Either as EitherComponent, sequence } from "../../../ui/Either";
import {
  getEventSharesByUser,
  getEventSharesByUserAndCategory,
  getUserTotalExpenseAmount,
  getUserTotalSharesAmount,
} from "../../../service/calculation";

import { Alert } from "../../../ui/Alert/Alert";
import { Card } from "../../../ui/Card/Card";
import { CategoryIcon } from "../../../ui/CategoryIcon/CategoryIcon";
import { Columns } from "../../../ui/Columns/Columns";
import { Container } from "../../../ui/Container/Container";
import { DateFormatter } from "../../../ui/DateFormatter/DateFormatter";
import { Deposit } from "../../../models/Deposit";
import { Divider } from "../../../ui/Divider/Divider";
import { Event } from "../../../models/Event";
import { ExchangeMoneyIcon } from "../../../ui/Icon/private/ExchangeMoneyIcon";
import { Expense } from "../../../models/Expense";
import { Heading } from "../../../ui/Heading/Heading";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { PieChart } from "../../../ui/Pie/PieChart";
import { Price } from "../../../ui/Price/Price";
import { PriceEvolution } from "./PriceEvolution/PriceEvolution";
import { Select } from "../../../ui/FormField/Select/Select";
import { Stack } from "../../../ui/Stack/Stack";
import { User } from "../../../models/User";
import { centToDecimal } from "../../../helpers/Number";
import { pipe } from "fp-ts/function";
import { sort } from "../../../utils/date";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type UserShareListProps = {
  event: Event;
  expenses: Record<string, Expense>;
  deposits: Record<string, Deposit>;
  users: Record<string, User>;
  currentUserId: string;
};

export function UserShareList({
  event,
  expenses,
  deposits,
  users,
  currentUserId,
}: UserShareListProps) {
  const { t } = useTranslation();
  const [userId, setUserId] = useState<string>(currentUserId);

  const eventSharesByUser = getEventSharesByUser({
    event,
    expenses,
    users,
    deposits,
    userId,
  });

  const sharesByCategory = pipe(
    getEventSharesByUserAndCategory({
      shares: eventSharesByUser,
    }),
    Either.map((shares) => {
      if (shares.deposit < 0) {
        const { deposit, ...otherCategories } = shares;
        return otherCategories;
      }
      return shares;
    })
  );

  const totalShares = pipe(
    eventSharesByUser,
    Either.map((shares) => getUserTotalSharesAmount({ shares }))
  );

  const expenseShares = pipe(
    eventSharesByUser,
    Either.map((expenses) =>
      expenses
        .filter((expense) => expense.type === "expense")
        .sort((a, b) => -1 * sort(a.date, b.date))
    )
  );
  const depositShares = pipe(
    eventSharesByUser,
    Either.map((expenses) =>
      expenses
        .filter((expense) => expense.type === "deposit")
        .sort((a, b) => -1 * sort(a.date, b.date))
    )
  );

  const totalExpenseAmount = getUserTotalExpenseAmount({
    event,
    deposits,
    expenses,
    userId,
  });

  const totalDepositAmount = pipe(
    depositShares,
    Either.map((deposits) => deposits.reduce((acc, cur) => acc + cur.share, 0))
  );

  return (
    <EitherComponent
      data={sequence({
        expenses: expenseShares,
        deposits: depositShares,
        total: totalShares,
        totalDepositAmount,
        sharesByCategory,
        totalExpenseAmount,
      })}
      onLeft={() => <Paragraph>{t("page.usershare.error")}</Paragraph>}
      onRight={({
        expenses,
        deposits,
        total,
        totalDepositAmount,
        sharesByCategory,
        totalExpenseAmount,
      }) => (
        <Stack gap="m" justifyContent="stretch">
          {!event.isClosed && (
            <Alert>{t("component.priceEvolution.difference.warning")}</Alert>
          )}
          <Select
            label={t("page.usershare.select.label")}
            onChange={(value) => setUserId(value)}
            value={userId}
            options={Object.entries(users).map(([id, user]) => ({
              value: id,
              label: user.name,
              id: user._id,
            }))}
            valueRenderer={(option) => (
              <div>
                <Columns
                  gap="s"
                  align="center"
                  styles={{ background: "transparent" }}
                >
                  <Avatar label={option.label} size="m" />
                </Columns>
              </div>
            )}
          />
          <Card>
            <Stack gap="m" justifyContent="stretch">
              <Heading level={2}>{t("page.usershare.summary.title")}</Heading>
              <PieChart
                data={Object.entries(sharesByCategory).map(([key, value]) => ({
                  id: key,
                  label:
                    key in event.categories
                      ? event.categories[key].name
                      : t(key === "deposit" ? "deposit" : "category.unknwon"),
                  value: centToDecimal(value),
                  color: computeRandomColor(
                    key in event.categories ? event.categories[key].icon : key
                  ),
                }))}
                valueFormatter={(value) =>
                  t("component.price.value", { value })
                }
              />
              <Divider />
              <Container styles={{ textAlign: "end" }}>
                <PriceEvolution total={total}>
                  {totalExpenseAmount}
                </PriceEvolution>
              </Container>
            </Stack>
          </Card>
          {deposits.length > 0 && (
            <Card>
              <Stack gap="m" justifyContent="stretch">
                <Columns gap="m" align="center">
                  <Heading level={2} styles={{ flexGrow: true }}>
                    {t("page.usershare.deposit.title")}
                  </Heading>
                  <Price type="total">{totalDepositAmount}</Price>
                </Columns>
                <Divider />
                {deposits.map((deposit) => (
                  <Stack key={deposit._id}>
                    <Columns gap="m" align="center">
                      <span
                        style={{
                          fontSize: "3.2rem",
                          color: computeRandomColor("deposit"),
                        }}
                      >
                        <ExchangeMoneyIcon strokeWidth={0.5} />
                      </span>
                      <Stack>
                        <DateFormatter>{deposit.date}</DateFormatter>
                        <Columns align="center" gap="s">
                          <Avatar
                            label={
                              users[
                                deposit.from === currentUserId
                                  ? deposit.from
                                  : deposit.to
                              ].name
                            }
                            size="s"
                          />
                          <Paragraph styles={{ font: "body-small" }}>
                            {
                              users[
                                deposit.share < 0 ? deposit.from : deposit.to
                              ].name
                            }
                          </Paragraph>
                        </Columns>
                      </Stack>
                      <Price type="sum">{deposit.share}</Price>
                    </Columns>
                  </Stack>
                ))}
              </Stack>
            </Card>
          )}
          <Card>
            <Stack gap="m" justifyContent="stretch">
              <Columns gap="m">
                <Heading level={2} styles={{ flexGrow: true }}>
                  {t("page.usershare.expense.title")}
                </Heading>
                <Price type="total">{total}</Price>
              </Columns>
              <Divider />
              {expenses.map((expense) => (
                <Stack key={expense._id}>
                  <Columns gap="m" align="center">
                    <CategoryIcon
                      name={event.categories[expense.category].icon}
                      label={event.categories[expense.category].name}
                      size="m"
                    />
                    <Stack>
                      <DateFormatter>{expense.date}</DateFormatter>
                      <Columns align="center" gap="s">
                        <Avatar label={users[expense.lender].name} size="s" />
                        <Paragraph styles={{ font: "body-small" }}>
                          {users[expense.lender].name}
                        </Paragraph>
                      </Columns>
                    </Stack>
                    <Price type="sum">{expense.share}</Price>
                  </Columns>
                </Stack>
              ))}
            </Stack>
          </Card>
        </Stack>
      )}
    />
  );
}
