import { useTranslation } from "react-i18next";
import { type Presence } from "../../../service/activities";
import { DateFormatter } from "../../../ui/DateFormatter/DateFormatter";
import { Stack } from "../../../ui/Stack/Stack";
import { Icon } from "../../../ui/Icon/Icon";
import { Grid } from "../../../ui/Grid/Grid";
import { dateToKey } from "../../../utils/date";
import { HEADER_HEIGHT } from "../../../shared/PageTemplate/Header";
import type { User } from "../../../models/User";
import { Container } from "../../../ui/Container/Container";
import type { Activity } from "../../../models/Activity";
import { MealManagementCard } from "./MealManagementCard";
import { ActivityCard } from "./ActivityCard";
import { NoActivityCard } from "./NoActivityCard";
import {
  sortByKey,
  sortDates,
  sortBooleans,
  sortByPriority,
} from "../../../utils/array";
import { useRef, useState } from "react";
import { Button } from "../../../ui/Button/Button";
import { AddActivityModal } from "./AddActivityModal";
import { Card } from "../../../ui/Card/Card";
import { Heading } from "../../../ui/Heading/Heading";

type DaySumaryProps = {
  currentUser: User;
  day: Date;
  presence: Presence;
  participants: Record<string, User>;
  activities?: Activity[];
  lunchManager: string;
  dinnerManager: string;
  setLunchManager: (lunchManager: string) => void;
  setDinnerManager: (dinnerManager: string) => void;
  addActivity: (activity: Activity) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (activity: Activity) => void;
};

export function DaySumary({
  day,
  presence,
  currentUser,
  activities = [],
  participants,
  lunchManager,
  dinnerManager,
  setLunchManager,
  setDinnerManager,
  addActivity,
  updateActivity,
}: DaySumaryProps) {
  const { t } = useTranslation();
  const currentDay = useRef(dateToKey(new Date()));
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState(false);

  const sortedActivities = activities.sort(
    sortByPriority([
      sortByKey("startDate", "asc", sortDates),
      sortByKey("isAllDay", "desc", sortBooleans),
    ])
  );

  return (
    <Card>
      <Stack gap="m">
        <Grid gap="s" align="center" columns={["auto", "auto", "1fr"]}>
          <Container
            styles={{
              border:
                currentDay.current === dateToKey(day) ? "none" : "default",
              background:
                currentDay.current === dateToKey(day) ? "inverted" : "default",
              display: "inline-block",
              width: "0.8rem",
              height: "3.2rem",
              radius: "m",
            }}
          >
            {undefined}
          </Container>
          <Container
            styles={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color:
                currentDay.current === dateToKey(day)
                  ? "primary-stronger"
                  : "neutral-default",
            }}
          >
            <Icon name="calendar-day" size="m" />
          </Container>

          <div
            id={dateToKey(day)}
            style={{
              scrollMarginTop: HEADER_HEIGHT,
            }}
          >
            <Heading
              level={2}
              styles={{
                color:
                  currentDay.current === dateToKey(day)
                    ? "primary-stronger"
                    : "neutral-default",
              }}
            >
              <DateFormatter format="AbbrNoYear">{day}</DateFormatter>
            </Heading>
          </div>
        </Grid>
        <MealManagementCard
          presence={presence}
          participants={participants}
          lunchManager={lunchManager}
          dinnerManager={dinnerManager}
          setLunchManager={setLunchManager}
          setDinnerManager={setDinnerManager}
        />
        {sortedActivities.length > 0 && (
          <Heading level={3}>{t("DaySumary.subtilte.activities")}</Heading>
        )}
        {sortedActivities.length === 0 && (
          <NoActivityCard
            addActivity={addActivity}
            currentUser={currentUser}
            defaultDate={day}
          />
        )}
        {sortedActivities.map((activity) => (
          <ActivityCard
            key={activity._id}
            activity={activity}
            updateActivity={updateActivity}
          />
        ))}
        {sortedActivities.length > 0 && (
          <Container styles={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="tertiary"
              icon={{ name: "add", position: "end" }}
              label={t("DaySumary.activity.actions.add")}
              onClick={() => {
                setIsAddActivityModalOpen(true);
              }}
            />
          </Container>
        )}
      </Stack>
      <AddActivityModal
        defaultDate={day}
        isOpen={isAddActivityModalOpen}
        setIsOpen={setIsAddActivityModalOpen}
        onSubmit={addActivity}
        currentUser={currentUser}
      />
    </Card>
  );
}
