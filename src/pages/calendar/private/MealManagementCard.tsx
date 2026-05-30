import { Avatar } from "../../../ui/Avatar/Avatar";
import { Columns } from "../../../ui/Columns/Columns";
import { Container } from "../../../ui/Container/Container";
import { Grid } from "../../../ui/Grid/Grid";
import { Heading } from "../../../ui/Heading/Heading";
import { MediaCard } from "../../../ui/MediaCard/MediaCard";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Pill } from "../../../ui/Pill/Pill";
import type { Presence } from "../../../service/activities";
import { Select } from "../../../ui/FormField/Select/Select";
import { Stack } from "../../../ui/Stack/Stack";
import type { User } from "../../../models/User";
import { useCurrentUser } from "../../../store/useCurrentUser";
import { useTranslation } from "react-i18next";

type MealManagementCardProps = {
  isReadOnly: boolean;
  isActive: boolean;
  presence: Presence;
  participants: Record<string, User>;
  lunchManager: string;
  dinnerManager: string;
  setLunchManager: (lunchManager: string) => void;
  setDinnerManager: (dinnerManager: string) => void;
};

export function MealManagementCard({
  isReadOnly,
  isActive,
  presence,
  participants,
  lunchManager,
  dinnerManager,
  setLunchManager,
  setDinnerManager,
}: MealManagementCardProps) {
  const { t } = useTranslation();
  const { isCurrentUser } = useCurrentUser();

  const missingManager =
    presence.lunch &&
    lunchManager === "none" &&
    presence.dinner &&
    dinnerManager === "none"
      ? "both"
      : presence.lunch && lunchManager === "none"
        ? "lunch"
        : presence.dinner && dinnerManager === "none"
          ? "dinner"
          : undefined;

  return (
    <MediaCard
      image="noodles"
      color="var(--ui-semantic-color-warning)"
      isActive={isActive}
    >
      <Stack gap="s">
        <Columns gap="m" justify="space-between">
          <Heading level={3}>{t("MealManagementCard.subtilte.meal")}</Heading>
          {missingManager && !isReadOnly && (
            <Container styles={{ alignSelf: "end", width: "fit-content" }}>
              <Pill color="failure" icon="warning">
                {t("DaySumary.mealManagement.missingManagers", {
                  when: missingManager,
                })}
              </Pill>
            </Container>
          )}
        </Columns>
        <Grid
          gap="s"
          columns={{ default: ["1fr"], sm: ["1fr", "18rem"] }}
          align="center"
        >
          {presence.lunch && (
            <>
              <Paragraph>
                {t("DaySumary.lunch", {
                  adults: presence.lunch.adults,
                  children: presence.lunch.children,
                })}
              </Paragraph>
              {isReadOnly ? (
                participants[lunchManager] != null ? (
                  <Columns align="center" gap="s">
                    <Avatar
                      id={lunchManager}
                      label={participants[lunchManager]?.name}
                      image={participants[lunchManager]?.avatar}
                      size="s"
                    />
                    <Paragraph>{participants[lunchManager]?.name}</Paragraph>
                  </Columns>
                ) : (
                  <span />
                )
              ) : (
                <Select
                  label={t("DaySumary.lunchManager")}
                  value={lunchManager}
                  onChange={setLunchManager}
                  options={[
                    {
                      id: "none",
                      label: t("DaySumary.noManager"),
                      value: "none",
                    },
                    ...Object.keys(participants).map((participant) => ({
                      id: participant,
                      label: isCurrentUser(participants[participant])
                        ? t("currentUser.name")
                        : participants[participant].name,
                      value: participant,
                    })),
                  ]}
                  valueRenderer={({ value }) =>
                    value !== "none" ? (
                      <Avatar
                        id={value}
                        label={participants[value]?.name}
                        image={participants[value]?.avatar}
                        size="s"
                      />
                    ) : null
                  }
                />
              )}
            </>
          )}
          {presence.dinner && (
            <>
              <Paragraph>
                {t("DaySumary.dinner", {
                  adults: presence.dinner.adults,
                  children: presence.dinner.children,
                })}
              </Paragraph>
              {isReadOnly ? (
                participants[dinnerManager] != null ? (
                  <Columns align="center" gap="s">
                    <Avatar
                      id={dinnerManager}
                      label={participants[dinnerManager]?.name}
                      image={participants[dinnerManager]?.avatar}
                      size="s"
                    />
                    <Paragraph>{participants[dinnerManager]?.name}</Paragraph>
                  </Columns>
                ) : (
                  <span />
                )
              ) : (
                <Select
                  label={t("DaySumary.dinnerManager")}
                  value={dinnerManager}
                  onChange={setDinnerManager}
                  options={[
                    {
                      id: "none",
                      label: t("DaySumary.noManager"),
                      value: "none",
                    },
                    ...Object.keys(participants).map((participant) => ({
                      id: participant,
                      label: isCurrentUser(participants[participant])
                        ? t("currentUser.name")
                        : participants[participant].name,
                      value: participant,
                    })),
                  ]}
                  valueRenderer={({ value }) =>
                    value !== "none" ? (
                      <Avatar
                        id={value}
                        label={participants[value]?.name}
                        image={participants[value]?.avatar}
                        size="s"
                      />
                    ) : null
                  }
                />
              )}
            </>
          )}
        </Grid>
      </Stack>
    </MediaCard>
  );
}
