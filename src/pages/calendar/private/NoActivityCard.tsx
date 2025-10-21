import type { Activity } from "../../../models/Activity";
import { AddActivityModal } from "./AddActivityModal";
import { EmptyState } from "../../../ui/EmptyState/EmptyState";
import type { User } from "../../../models/User";
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
      <EmptyState
        title={t("DaySumary.noActivity.title")}
        description={t("DaySumary.noActivity.description")}
        illustration="pig-isle"
        action={{
          onClick: () => {
            setIsOpen(true);
          },
          icon: { name: "add", position: "end" },
          label: t("DaySumary.noActivity.button"),
        }}
      />
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
