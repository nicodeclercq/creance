import type { Activity } from "../../../models/Activity";
import { ActivityForm } from "./ActivityForm";
import { Modal } from "../../../ui/Modal/Modal";
import { useTranslation } from "react-i18next";

type EditActivityModalProps = {
  activity: Activity;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (activity: Activity) => void;
};

export function EditActivityModal({
  activity,
  isOpen,
  setIsOpen,
  onSubmit,
}: EditActivityModalProps) {
  const { t } = useTranslation();
  return (
    <Modal title={t("EditActivityModal.title")} isOpen={isOpen}>
      <ActivityForm
        cancel={{
          onClick: () => setIsOpen(false),
          label: t("EditActivityModal.actions.cancel"),
        }}
        submitLabel={t("EditActivityModal.actions.submit")}
        onSubmit={onSubmit}
        defaultValue={activity}
      />
    </Modal>
  );
}
