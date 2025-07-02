import * as Either from "fp-ts/Either";

import { Either as EitherComponent, sequence } from "../../../ui/Either";
import {
  getDepositShares,
  getEventSharesByUser,
  getEventSharesByUserAndCategory,
  getTotalDepositAmount,
  getUserTotalExpenseAmount,
  getUserTotalSharesAmount,
} from "../../../service/calculation";

import { Alert } from "../../../ui/Alert/Alert";
import { Avatar } from "../../../ui/Avatar/Avatar";
import { Columns } from "../../../ui/Columns/Columns";
import { DepositsShare } from "./DepositsShare";
import { Event } from "../../../models/Event";
import { ExpenseShare } from "./ExpenseShare";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Results } from "./Results";
import { Select } from "../../../ui/FormField/Select/Select";
import { Stack } from "../../../ui/Stack/Stack";
import { User } from "../../../models/User";
import { pipe } from "fp-ts/function";
import { sort } from "../../../utils/date";
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

  const eventSharesByUser = getEventSharesByUser({
    event,
    users,
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
    Either.map((expenses) => expenses.sort((a, b) => -1 * sort(a.date, b.date)))
  );

  const depositShares = pipe(
    getDepositShares({ event, users }),
    Either.map((deposits) =>
      deposits[userId]
        ? deposits[userId].sort((a, b) => -1 * sort(a.date, b.date))
        : []
    )
  );

  const totalExpenseAmount = getUserTotalExpenseAmount({
    event,
    userId,
  });

  const totalDepositsAmount = pipe(
    depositShares,
    Either.map((depositShares) => getTotalDepositAmount(depositShares))
  );

  return (
    <EitherComponent
      data={sequence({
        expenses: expenseShares,
        deposits: depositShares,
        total: totalShares,
        totalDepositsAmount,
        sharesByCategory,
        totalExpenseAmount,
      })}
      onLeft={() => <Paragraph>{t("page.usershare.error")}</Paragraph>}
      onRight={({
        expenses,
        deposits,
        total,
        sharesByCategory,
        totalExpenseAmount,
        totalDepositsAmount,
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
          <ExpenseShare
            total={total}
            event={event}
            users={users}
            expenses={expenses}
            sharesByCategory={sharesByCategory}
          />
          <DepositsShare deposits={deposits} users={users} />
          <Results total={total} deposits={totalDepositsAmount}>
            {totalExpenseAmount}
          </Results>
        </Stack>
      )}
    />
  );
}
