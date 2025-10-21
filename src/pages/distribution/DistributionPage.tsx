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
import { useData } from "../../store/useData";
import { useEventParticipants } from "../../hooks/useEventParticipants";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function DistributionPage() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const [currentEvent] = useData(`events.${eventId}`);
  const [currentParticipantId] = useData(`account.events.${eventId}.uid`);

  if (!eventId || !currentEvent) {
    return <EventNotFoundPage />;
  }
  const participants = useEventParticipants(eventId);

  if (Object.keys(currentEvent.expenses).length === 0) {
    return (
      <EventPageTemplate event={currentEvent}>
        <EmptyEvent event={currentEvent} />
      </EventPageTemplate>
    );
  }

  const distribution = pipe(
    getEventDistribution({ event: currentEvent }),
    Either.map((dist) => {
      const currentParticipantDistribution = dist[currentParticipantId];
      delete dist[currentParticipantId];

      return {
        currentParticipantDistribution,
        otherParticipantsDistribution: dist,
      };
    })
  );

  return (
    <EventPageTemplate event={currentEvent}>
      <EitherComponent
        data={distribution}
        onLeft={() => <>Error</>}
        onRight={({
          currentParticipantDistribution,
          otherParticipantsDistribution,
        }) => (
          <Stack gap="m">
            {!currentEvent.isClosed && (
              <Alert>{t("page.distribution.warning.notClosed")}</Alert>
            )}
            <DistributionItem
              isCurrentParticipant
              key={currentParticipantId}
              participantId={currentParticipantId}
              distributions={currentParticipantDistribution ?? []}
              participants={participants}
            />
            {Object.entries(otherParticipantsDistribution).map(
              ([participantId, distributions]) => (
                <DistributionItem
                  isCurrentParticipant={false}
                  key={participantId}
                  participantId={participantId}
                  distributions={distributions ?? []}
                  participants={participants}
                />
              )
            )}
          </Stack>
        )}
      />
    </EventPageTemplate>
  );
}
