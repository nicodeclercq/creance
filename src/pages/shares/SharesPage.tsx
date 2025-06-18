import * as RecordFP from "fp-ts/Record";

import { Card } from "../../ui/Card/Card";
import { EventNotFoundPage } from "../event/private/EventNotFoundPage";
import { PageTemplate } from "../../shared/PageTemplate/PageTemplate";
import { ShareItem } from "./private/ShareItem";
import { Stack } from "../../ui/Stack/Stack";
import { pipe } from "fp-ts/function";
import { useEventUsers } from "../../hooks/useEventUsers";
import { useParams } from "react-router-dom";
import { useStore } from "../../store/StoreProvider";
import { useTranslation } from "react-i18next";

export function SharesPage() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const users = useEventUsers(eventId);
  const [currentEvent, setCurrentEvent] = useStore(`events.${eventId}`);

  if (!eventId || !currentEvent) {
    return <EventNotFoundPage />;
  }

  const onDelete = (userId: string) => () => {
    setCurrentEvent((event) => ({
      ...event,
      shares: pipe(event.shares, RecordFP.deleteAt(userId)),
    }));
  };

  return (
    <PageTemplate
      title={t("page.event.shares.title")}
      leftAction={{
        as: "link",
        icon: "chevron-left",
        label: t("page.event.edit.actions.backToEvent"),
        to: "EVENT",
        params: { eventId },
      }}
    >
      <Card>
        <Stack gap="m" as="ul">
          {Object.keys(currentEvent.shares).map((userId) => (
            <ShareItem
              eventId={currentEvent._id}
              share={currentEvent.shares[userId]}
              onDelete={onDelete(userId)}
              user={users[userId]}
              key={userId}
            />
          ))}
        </Stack>
      </Card>
    </PageTemplate>
  );
}
