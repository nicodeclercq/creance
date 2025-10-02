import {
  getActivitiesByDays,
  getPresenceByDays,
} from "../../service/activities";
import { useLocation, useParams } from "react-router-dom";

import { Activity } from "../../models/Activity";
import { DaySumary } from "./private/DaySumary";
import { EventNotFoundPage } from "../event/private/EventNotFoundPage";
import { EventPageTemplate } from "../../shared/PageTemplate/EventPageTemplate";
import { Stack } from "../../ui/Stack/Stack";
import { useCurrentUser } from "../../store/useCurrentUser";
import { useData } from "../../store/useData";
import { useEffect } from "react";

export function CalendarPage() {
  const { eventId } = useParams();
  const { hash } = useLocation();
  const { currentUser } = useCurrentUser();
  const [currentEvent, setCurrentEvent] = useData(`events.${eventId}`);
  const [mealManagers, setMealManagers] = useData(
    `events.${eventId}.mealManager`
  );

  const setLunchManager = (day: string) => (lunchManager: string) => {
    setMealManagers((prev) => ({
      ...prev,
      [day]: { ...prev[day], lunch: lunchManager },
    }));
  };
  const setDinnerManager = (day: string) => (dinnerManager: string) => {
    setMealManagers((prev) => ({
      ...prev,
      [day]: { ...prev[day], dinner: dinnerManager },
    }));
  };

  const addActivity = (activity: Activity) => {
    setCurrentEvent((prev) => ({
      ...prev,
      activities: {
        ...prev.activities,
        [activity._id]: activity,
      },
    }));
  };
  const updateActivity = (activity: Activity) => {
    setCurrentEvent((prev) => ({
      ...prev,
      activities: {
        ...prev.activities,
        [activity._id]: activity,
      },
    }));
  };
  const deleteActivity = (activity: Activity) => {
    setCurrentEvent((prev) => {
      const { [activity._id]: _, ...activities } = prev.activities;
      return {
        ...prev,
        activities,
      };
    });
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
            key={day}
            day={new Date(day)}
            presence={presence}
            activities={activitiesByDays[day]}
            participants={currentEvent.participants}
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
