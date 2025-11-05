import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import { Stack } from "../Stack/Stack";
import { Paragraph } from "../Paragraph/Paragraph";
import { Columns } from "../Columns/Columns";

type ConfirmDialogProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  cancel: {
    label: string;
    onClick: () => void;
  };
  confirm: {
    label: string;
    onClick: () => void;
  };
};

export function ConfirmDialog({
  title,
  description,
  isOpen,
  onOpenChange,
  cancel,
  confirm,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} isOpen={isOpen} onOpenChange={onOpenChange}>
      <Stack gap="m" padding="l">
        <Paragraph>{description}</Paragraph>
        <Columns justify="end" gap="s" wrap>
          <Button onClick={cancel.onClick} variant="secondary" label={cancel.label} />
          <Button onClick={confirm.onClick} variant="primary" label={confirm.label} />
        </Columns>
      </Stack>
    </Modal>
  );
}
