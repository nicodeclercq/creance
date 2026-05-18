import type { Activity } from "../../../models/Activity";
import { ActivityForm } from "./ActivityForm";
import { Modal } from "../../../ui/Modal/Modal";
import { createMergeableRecord } from "../../../models/mergeable";
import { uid } from "../../../service/crypto";
import { useCurrentUser } from "../../../store/useCurrentUser";
import { useTranslation } from "react-i18next";

type AddActivityModalProps = {
  defaultDate?: Date;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (activity: Activity) => void;
};

const createActivity = (
  userId: string,
  defaultDate: Date = new Date(),
): Activity => {
  const startDate = new Date(defaultDate);
  const endDate = new Date(defaultDate);
  endDate.setHours(endDate.getHours() + 1);

  return createMergeableRecord({
    _id: uid(),
    name: "",
    description: "",
    isAllDay: false,
    startDate,
    endDate,
    proposedBy: userId,
    reservationRequired: false,
  });
};

export function AddActivityModal({
  defaultDate,
  isOpen,
  setIsOpen,
  onSubmit,
}: AddActivityModalProps) {
  const { t } = useTranslation();
  const { userId } = useCurrentUser();

  return (
    <Modal title={t("AddActivityModal.title")} isOpen={isOpen}>
      <ActivityForm
        cancel={{
          onClick: () => setIsOpen(false),
          label: t("AddActivityModal.actions.cancel"),
        }}
        submitLabel={t("AddActivityModal.actions.submit")}
        onSubmit={(activity) => {
          onSubmit(activity);
          setIsOpen(false);
        }}
        defaultValue={createActivity(userId, defaultDate)}
      />
    </Modal>
  );
}
