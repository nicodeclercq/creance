import * as Either from "fp-ts/Either";

import { Either as EitherComponent, sequence } from "../../../ui/Either";
import {
  getDepositShares,
  getEventSharesByParticipant,
  getEventSharesByParticipantAndCategory,
  getParticipantTotalExpenseAmount,
  getParticipantTotalSharesAmount,
  getTotalDepositAmount,
} from "../../../service/calculation";

import { Alert } from "../../../ui/Alert/Alert";
import { Avatar } from "../../../ui/Avatar/Avatar";
import { Columns } from "../../../ui/Columns/Columns";
import { DepositsShare } from "./DepositsShare";
import { Event } from "../../../models/Event";
import { ExpenseShare } from "./ExpenseShare";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Participant } from "../../../models/Participant";
import { Results } from "./Results";
import { Select } from "../../../ui/FormField/Select/Select";
import { Stack } from "../../../ui/Stack/Stack";
import { pipe } from "fp-ts/function";
import { sort } from "../../../utils/date";
import { useCurrentUser } from "../../../store/useCurrentUser";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ParticipantShareListProps = {
  event: Event;
  participants: Record<string, Participant>;
  currentParticipantId: string;
};

export function ParticipantShareList({
  event,
  participants,
  currentParticipantId,
}: ParticipantShareListProps) {
  const { t } = useTranslation();
  const { isCurrentUser } = useCurrentUser();
  const [participantId, setParticipantId] =
    useState<string>(currentParticipantId);

  const eventSharesByParticipant = getEventSharesByParticipant({
    event,
    participantId,
  });

  const sharesByCategory = pipe(
    getEventSharesByParticipantAndCategory({
      shares: eventSharesByParticipant,
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
    eventSharesByParticipant,
    Either.map((shares) => getParticipantTotalSharesAmount({ shares }))
  );

  const expenseShares = pipe(
    eventSharesByParticipant,
    Either.map((expenses) => expenses.sort((a, b) => -1 * sort(a.date, b.date)))
  );

  const depositShares = pipe(
    getDepositShares({ event, participants: event.participants }),
    Either.map((deposits) =>
      deposits[participantId]
        ? deposits[participantId].sort((a, b) => -1 * sort(a.date, b.date))
        : []
    )
  );

  const totalExpenseAmount = getParticipantTotalExpenseAmount({
    event,
    participantId,
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
      onLeft={() => <Paragraph>{t("page.participantshare.error")}</Paragraph>}
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
            label={t("page.participantshare.select.label")}
            onChange={(value) => setParticipantId(value)}
            value={participantId}
            options={Object.entries(participants).map(([id, participant]) => ({
              value: id,
              label: isCurrentUser(participant)
                ? t("currentUser.anonymous.name")
                : participant.name,
              id: participant._id,
            }))}
            valueRenderer={(option) => (
              <div>
                <Columns gap="s" align="center">
                  <Avatar
                    label={
                      isCurrentUser(participants[option.id])
                        ? t("currentUser.anonymous.name")
                        : option.label
                    }
                    image={participants[option.id].avatar}
                    size="m"
                  />
                </Columns>
              </div>
            )}
          />
          <ExpenseShare
            total={total}
            event={event}
            participants={participants}
            expenses={expenses}
            sharesByCategory={sharesByCategory}
          />
          <DepositsShare deposits={deposits} participants={participants} />
          <Results total={total} deposits={totalDepositsAmount}>
            {totalExpenseAmount}
          </Results>
        </Stack>
      )}
    />
  );
}
