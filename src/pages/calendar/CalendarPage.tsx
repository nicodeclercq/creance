import {
  addMergeableCollectionItem,
  createMergeableRecord,
  deleteMergeableCollectionItem,
  updateMergeableCollectionItem,
} from "../../models/mergeable";
import {
  getActivitiesByDays,
  getPresenceByDays,
} from "../../service/activities";
import { useLocation, useParams } from "react-router-dom";

import type { Activity } from "../../models/Activity";
import { DaySumary } from "./private/DaySumary";
import { EventNotFoundPage } from "../event/private/EventNotFoundPage";
import { EventPageTemplate } from "../../shared/PageTemplate/EventPageTemplate";
import { Stack } from "../../ui/Stack/Stack";
import { keyToDate } from "../../utils/date";
import { useCurrentUser } from "../../store/useCurrentUser";
import { useData } from "../../store/useData";
import { useEffect } from "react";

export function CalendarPage() {
  const { eventId } = useParams();
  const { hash } = useLocation();
  const { currentUser } = useCurrentUser();
  const [currentEvent, setCurrentEvent] = useData(
    `events.collection.${eventId}`,
  );
  const [mealManagers, setMealManagers] = useData(
    `events.collection.${eventId}.mealManager`,
  );

  const setLunchManager = (day: string) => (lunchManager: string) => {
    setMealManagers((prev) => ({
      ...prev,
      [day]: createMergeableRecord({ ...prev[day], lunch: lunchManager }),
    }));
  };
  const setDinnerManager = (day: string) => (dinnerManager: string) => {
    setMealManagers((prev) => ({
      ...prev,
      [day]: createMergeableRecord({ ...prev[day], dinner: dinnerManager }),
    }));
  };

  const addActivity = (activity: Activity) => {
    setCurrentEvent((prev) => ({
      ...prev,
      activities: addMergeableCollectionItem(
        activity._id,
        activity,
        prev.activities,
      ),
    }));
  };
  const updateActivity = (activity: Activity) => {
    setCurrentEvent((prev) => ({
      ...prev,
      activities: updateMergeableCollectionItem(
        activity._id,
        activity,
        prev.activities,
      ),
    }));
  };
  const deleteActivity = (activity: Activity) => {
    setCurrentEvent((prev) => ({
      ...prev,
      activities: deleteMergeableCollectionItem(activity._id, prev.activities),
    }));
  };

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(`${hash.slice(1)}`);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }
  }, [hash]);

  if (!eventId) {
    return <EventNotFoundPage />;
  }

  const presenceByDays = getPresenceByDays(currentEvent);

  const activitiesByDays = getActivitiesByDays(currentEvent);

  return (
    <EventPageTemplate event={currentEvent}>
      <Stack gap="l">
        {Object.entries(presenceByDays).map(([day, presence]) => (
          <DaySumary
            isReadOnly={currentEvent.isClosed ?? false}
            key={day}
            day={keyToDate(day)}
            presence={presence}
            activities={activitiesByDays[day]}
            participants={currentEvent.participants.collection}
            lunchManager={mealManagers[day]?.lunch ?? "none"}
            dinnerManager={mealManagers[day]?.dinner ?? "none"}
            setLunchManager={setLunchManager(day)}
            setDinnerManager={setDinnerManager(day)}
            addActivity={addActivity}
            updateActivity={updateActivity}
            deleteActivity={deleteActivity}
            currentUser={currentUser}
          />
        ))}
      </Stack>
    </EventPageTemplate>
  );
}
