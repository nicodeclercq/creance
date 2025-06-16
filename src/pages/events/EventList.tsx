import { Button } from "../../ui/Button/Button";
import { Card } from "../../ui/Card/Card";
import { EmptyEventList } from "./EmptyEventList";
import { Event } from "../../models/Event";
import { EventItem } from "./EventItem/EventItem";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { ROUTES } from "../../routes";
import { Stack } from "../../ui/Stack/Stack";
import { User } from "../../models/User";
import { useTranslation } from "react-i18next";

type EventListProps = {
  events: Event[];
  users: Record<string, User>;
};

export function EventList({ events, users }: EventListProps) {
  const { t } = useTranslation();

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
      {events.length === 0 ? (
        <EmptyEventList />
      ) : (
        <Card>
          <Stack gap="s" alignItems="stretch">
            <Stack as="ol" gap="none">
              {events.map((event) => (
                <EventItem key={event._id} event={event} users={users} />
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
