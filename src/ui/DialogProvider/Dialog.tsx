import { type ReactNode, useCallback } from "react";
import { Modal } from "../Modal/Modal";
import { useTranslation } from "react-i18next";

export type DialogConfig<T = unknown> = {
  component: (props: {
    onSubmit: (data: T) => void;
    onCancel?: () => void;
    defaultData?: T;
  }) => ReactNode;
  title: string;
};

export type DialogResult<T> = { type: "submit"; data: T } | { type: "cancel" };

export type DialogInstance<T = unknown> = {
  id: symbol;
  config: DialogConfig<T>;
  defaultData?: T;
  resolve: (result: DialogResult<T>) => void;
};

type DialogProps = {
  instance: DialogInstance;
  onClose: (instance: DialogInstance) => void;
};

export function Dialog({ instance, onClose }: DialogProps) {
  const { t } = useTranslation();
  const handleSubmit = useCallback(
    (data: unknown) => {
      instance.resolve({ type: "submit", data });
      onClose(instance);
    },
    [instance, onClose]
  );

  const handleCancel = useCallback(() => {
    instance.resolve({ type: "cancel" });
    onClose(instance);
  }, [instance, onClose]);

  return (
    <Modal
      title={t(instance.config.title)}
      isOpen={true}
      isDismissable={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleCancel();
        }
      }}
    >
      {instance.config.component({
        onSubmit: handleSubmit,
        onCancel: handleCancel,
        defaultData: instance.defaultData,
      })}
    </Modal>
  );
}
