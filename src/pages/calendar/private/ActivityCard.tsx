import { Activity } from "../../../models/Activity";
import { Bleed } from "../../../ui/Bleed/Bleed";
import { Card } from "../../../ui/Card/Card";
import { Container } from "../../../ui/Container/Container";
import { EditActivityModal } from "./EditActivityModal";
import { ExternalLink } from "../../../ui/ExternalLink/ExternalLink";
import { Grid } from "../../../ui/Grid/Grid";
import { IconButton } from "../../../ui/IconButton/IconButton";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Pill } from "../../../ui/Pill/Pill";
import { Stack } from "../../../ui/Stack/Stack";
import { computeRandomColor } from "../../../ui/Avatar/Avatar";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ActivityCardProps = {
  activity: Activity;
  updateActivity: (activity: Activity) => void;
};

export function ActivityCard({ activity, updateActivity }: ActivityCardProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = (newActivity: Activity) => {
    setIsOpen(false);
    updateActivity(newActivity);
  };

  return (
    <>
      <Card key={activity._id}>
        <Grid columns={["15rem", "auto"]} gap="m">
          <Bleed direction={["top", "left", "bottom"]} height="100%">
            <div
              style={{
                width: "100%",
                height: "100%",
                minHeight: "8rem",
                backgroundImage: `url(${activity.image})`,
                backgroundColor: computeRandomColor(activity.name),
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderTopLeftRadius: "var(--ui-semantic-radius-m)",
                borderBottomLeftRadius: "var(--ui-semantic-radius-m)",
              }}
            />
          </Bleed>
          <Stack gap="s">
            <Container
              styles={{
                font: "body-small",
                color: "neutral-strong",
                display: "grid",
                gap: "s",
                gridTemplateColumns: ["1fr", "max-content"],
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Paragraph
                styles={{ color: "neutral-default", font: "body-large" }}
              >
                {activity.name}
              </Paragraph>
              {activity.reservationRequired && (
                <Pill icon="ticket" color="warning">
                  {t("DaySumary.activity.reservationRequired")}
                </Pill>
              )}
            </Container>
            <Stack gap="s">
              <Paragraph
                styles={{ color: "neutral-strong", font: "body-small" }}
              >
                {activity.isAllDay
                  ? t("DaySumary.activity.time.allDayLong")
                  : t(
                      activity.endDate
                        ? "DaySumary.activity.duration-both"
                        : "DaySumary.activity.duration-start",
                      {
                        start: activity.startDate,
                        end: activity.endDate,
                      }
                    )}
              </Paragraph>
              {activity.description && (
                <Paragraph styles={{ font: "body-small" }}>
                  {activity.description}
                </Paragraph>
              )}
              <Grid
                columns={["auto", "max-content"]}
                gap="m"
                justify="space-between"
              >
                {activity.url ? (
                  <ExternalLink url={activity.url}>{activity.url}</ExternalLink>
                ) : (
                  <span></span>
                )}
                <IconButton
                  variant="tertiary"
                  icon="edit"
                  onClick={() => setIsOpen(true)}
                  label={t("ActivityCard.actions.edit")}
                />
              </Grid>
            </Stack>
          </Stack>
        </Grid>
      </Card>
      <EditActivityModal
        activity={activity}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={onSubmit}
      />
    </>
  );
}
