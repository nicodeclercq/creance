import { Activity } from "../../../models/Activity";
import { AddActivityModal } from "./AddActivityModal";
import { Button } from "../../../ui/Button/Button";
import { Card } from "../../../ui/Card/Card";
import { Illustration } from "../../../ui/Illustration/Illustration";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Stack } from "../../../ui/Stack/Stack";
import { User } from "../../../models/User";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type NoActivityCardProps = {
  defaultDate: Date;
  currentUser: User;
  addActivity: (activity: Activity) => void;
};

export function NoActivityCard({
  defaultDate,
  currentUser,
  addActivity,
}: NoActivityCardProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card>
        <Stack alignItems="center" gap="s">
          <Illustration name="pig-isle" size="m" ratio="4:3" />
          <Paragraph styles={{ font: "body-large", color: "neutral-weak" }}>
            {t("DaySumary.noActivity.title")}
          </Paragraph>
          <Button
            onClick={() => {
              setIsOpen(true);
            }}
            icon={{ name: "add", position: "end" }}
            label={t("DaySumary.noActivity.button")}
            variant="tertiary"
          />
        </Stack>
      </Card>
      <AddActivityModal
        defaultDate={defaultDate}
        isOpen={isOpen}
        currentUser={currentUser}
        setIsOpen={setIsOpen}
        onSubmit={addActivity}
      />
    </>
  );
}
