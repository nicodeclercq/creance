import { Button } from "../../ui/Button/Button";
import { Card } from "../../ui/Card/Card";
import { EmptyEventList } from "./EmptyEventList";
import { Event } from "../../models/Event";
import { EventItem } from "./EventItem/EventItem";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { ROUTES } from "../../routes";
import { Stack } from "../../ui/Stack/Stack";
import { sortByDate } from "../../utils/date";
import { useStore } from "../../store/StoreProvider";
import { useTranslation } from "react-i18next";

type Props = {
  events: Record<string, Event>;
};

export function EventList({ events }: Props) {
  const { t } = useTranslation();
  const eventsValues = Object.values(events).sort(
    sortByDate("updatedAt", "desc")
  );
  const [currentParticipantId] = useStore("currentParticipantId");

  const filteredEvents = eventsValues.filter((event) => {
    const eventParticipants = Object.keys(event.participants);
    return eventParticipants.includes(currentParticipantId);
  });

  return (
    <PageTemplate
      title={t("page.events.list.title")}
      rightActions={[
        {
          as: "link",
          label: t("page.information.title"),
          icon: "user",
          to: ROUTES.INFORMATION,
        },
      ]}
    >
      {filteredEvents.length === 0 ? (
        <EmptyEventList />
      ) : (
        <Card>
          <Stack gap="s" alignItems="stretch">
            <Stack as="ol" gap="none">
              {filteredEvents.map((event) => (
                <EventItem
                  key={event._id}
                  event={event}
                  participants={event.participants}
                />
              ))}
            </Stack>
            <Button
              label={t("page.events.list.actions.create")}
              as="link"
              to="EVENT_ADD"
              variant="primary"
            />
          </Stack>
        </Card>
      )}
    </PageTemplate>
  );
}
