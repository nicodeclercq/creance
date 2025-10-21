import type { Activity } from "../../../models/Activity";
import { ActivityForm } from "./ActivityForm";
import { Modal } from "../../../ui/Modal/Modal";
import type { User } from "../../../models/User";
import { uid } from "../../../service/crypto";
import { useTranslation } from "react-i18next";

type AddActivityModalProps = {
  defaultDate?: Date;
  isOpen: boolean;
  currentUser: User;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (activity: Activity) => void;
};

const createActivity = (
  currentUser: User,
  defaultDate: Date = new Date()
): Activity => {
  const startDate = new Date(defaultDate);
  const endDate = new Date(defaultDate);
  endDate.setHours(endDate.getHours() + 1);

  return {
    _id: uid(),
    name: "",
    description: "",
    isAllDay: false,
    startDate,
    endDate,
    proposedBy: currentUser._id,
    reservationRequired: false,
    updatedAt: new Date(),
  };
};

export function AddActivityModal({
  defaultDate,
  isOpen,
  currentUser,
  setIsOpen,
  onSubmit,
}: AddActivityModalProps) {
  const { t } = useTranslation();
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
        defaultValue={createActivity(currentUser, defaultDate)}
      />
    </Modal>
  );
}
