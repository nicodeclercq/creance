import * as Either from "fp-ts/Either";

import { Avatar, computeRandomColor } from "../../../ui/Avatar/Avatar";
import { Either as EitherComponent, sequence } from "../../../ui/Either";
import {
  getEventSharesByUser,
  getEventSharesByUserAndCategory,
  getUserTotalExpenseAmount,
} from "../../../service/calculation";

import { Card } from "../../../ui/Card/Card";
import { CategoryIcon } from "../../../ui/CategoryIcon/CategoryIcon";
import { Columns } from "../../../ui/Columns/Columns";
import { Container } from "../../../ui/Container/Container";
import { DateFormatter } from "../../../ui/DateFormatter/DateFormatter";
import { Divider } from "../../../ui/Divider/Divider";
import { Event } from "../../../models/Event";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { PieChart } from "../../../ui/Pie/PieChart";
import { Price } from "../../../ui/Price/Price";
import { PriceEvolution } from "./PriceEvolution/PriceEvolution";
import { Select } from "../../../ui/FormField/Select/Select";
import { Stack } from "../../../ui/Stack/Stack";
import { User } from "../../../models/User";
import { centToDecimal } from "../../../helpers/Number";
import { pipe } from "fp-ts/function";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type UserShareListProps = {
  event: Event;
  users: Record<string, User>;
  currentUserId: string;
};

export function UserShareList({
  event,
  users,
  currentUserId,
}: UserShareListProps) {
  const { t } = useTranslation();
  const [userId, setUserId] = useState<string>(currentUserId);

  const expenses = getEventSharesByUser({
    event,
    users,
    userId,
  });

  const sharesByCategory = getEventSharesByUserAndCategory({
    shares: expenses,
  });

  const total = pipe(
    expenses,
    Either.map((expenses) =>
      expenses.reduce((sum, expense) => sum + expense.share, 0)
    )
  );

  const totalExpenseAmount = getUserTotalExpenseAmount({ event, userId });

  return (
    <EitherComponent
      data={sequence({ expenses, total, sharesByCategory, totalExpenseAmount })}
      onLeft={() => <Paragraph>{t("page.usershare.error")}</Paragraph>}
      onRight={({ expenses, total, sharesByCategory, totalExpenseAmount }) => (
        <Stack gap="m" justifyContent="stretch">
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
              <PieChart
                data={Object.entries(sharesByCategory).map(([key, value]) => ({
                  id: key,
                  label: event.categories[key].name,
                  value: centToDecimal(value),
                  color: computeRandomColor(event.categories[key].icon),
                }))}
                valueFormatter={(value) =>
                  t("component.price.value", { value })
                }
              />
              <Divider />
              <Container styles={{ textAlign: "end" }}>
                <PriceEvolution event={event} total={total}>
                  {totalExpenseAmount}
                </PriceEvolution>
              </Container>
            </Stack>
          </Card>
          <Card>
            <Stack gap="m" justifyContent="stretch">
              {expenses.map((expense, index) => (
                <Stack key={index}>
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
