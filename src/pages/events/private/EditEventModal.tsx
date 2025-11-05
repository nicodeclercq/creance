import type { Event } from "../../../models/Event";
import { EventStep1Form, type Step1Data } from "./EventStep1Form";
import { Modal } from "../../../ui/Modal/Modal";
import { useTranslation } from "react-i18next";

type EditEventModalProps = {
  event: Event;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (data: Step1Data) => void;
};

export function EditEventModal({
  event,
  isOpen,
  setIsOpen,
  onSubmit,
}: EditEventModalProps) {
  const { t } = useTranslation();
  return (
    <Modal
      title={t("EditEventModal.title")}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      <EventStep1Form
        defaultValues={{
          name: event.name,
          description: event.description,
          dates: {
            start: event.period.start,
            end: event.period.end,
          },
          arrival: event.period.arrival,
          departure: event.period.departure,
          isAutoClose: event.isAutoClose,
        }}
        onSubmit={(data) => {
          onSubmit(data);
          setIsOpen(false);
        }}
        submitLabel={t("page.events.edit.form.submit")}
        cancel={{
          as: "button",
          label: t("page.events.edit.form.cancel"),
          onClick: () => setIsOpen(false),
        }}
        excludeEventId={event._id}
      />
    </Modal>
  );
}
