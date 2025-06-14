import * as Either from "fp-ts/Either";

import { Alert } from "../../ui/Alert/Alert";
import { DistributionItem } from "./private/DistributionItem";
import { Either as EitherComponent } from "../../ui/Either";
import { EmptyEvent } from "../event/EmptyEvent";
import { EventNotFoundPage } from "../event/private/EventNotFoundPage";
import { EventPageTemplate } from "../../shared/PageTemplate/EventPageTemplate";
import { Stack } from "../../ui/Stack/Stack";
import { getEventDistribution } from "../../service/calculation";
import { pipe } from "fp-ts/function";
import { useEventUsers } from "../../hooks/useEventUsers";
import { useParams } from "react-router-dom";
import { useStore } from "../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export function DistributionPage() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [currentEvent] = useStore(`events.${eventId}`);
  const [expenses] = useStore("expenses");
  const [currentUserId] = useStore("currentUserId");

  if (!eventId || !currentEvent) {
    return <EventNotFoundPage />;
  }
  const users = useEventUsers(eventId);

  if (currentEvent.expenses.length === 0) {
    return (
      <EventPageTemplate event={currentEvent}>
        <EmptyEvent event={currentEvent} />
      </EventPageTemplate>
    );
  }

  const distribution = pipe(
    getEventDistribution(currentEvent, expenses, users),
    Either.map((dist) => {
      const currentUserDistribution = dist[currentUserId];
      delete dist[currentUserId];

      return {
        currentUserDistribution,
        otherUsersDistribution: dist,
      };
    })
  );

  return (
    <EventPageTemplate event={currentEvent}>
      <EitherComponent
        data={distribution}
        onLeft={() => <>Error</>}
        onRight={({ currentUserDistribution, otherUsersDistribution }) => (
          <Stack gap="m">
            {!currentEvent.isClosed && (
              <Alert>{t("page.distribution.warning.notClosed")}</Alert>
            )}
            <DistributionItem
              isCurrentUser
              key={currentUserId}
              userId={currentUserId}
              distributions={currentUserDistribution}
              users={users}
            />
            {Object.entries(otherUsersDistribution).map(
              ([userId, distributions]) => (
                <DistributionItem
                  isCurrentUser={false}
                  key={userId}
                  userId={userId}
                  distributions={distributions}
                  users={users}
                />
              )
            )}
          </Stack>
        )}
      />
    </EventPageTemplate>
  );
}
