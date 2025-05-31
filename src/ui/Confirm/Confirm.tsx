import { AsButton, ButtonProps } from "../Button/Button";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
} from "react-aria-components";

import { Columns } from "../Columns/Columns";
import { Icon } from "../Icon/Icon";
import { Paragraph } from "../Paragraph/Paragraph";
import { Stack } from "../Stack/Stack";
import buttonStyles from "../Button/Button.module.css";
import classNames from "classnames";
import styles from "./Confirm.module.css";

export type ConfirmProps = {
  action: ButtonProps<AsButton> & { className?: string };
  title: string;
  description?: string;
  cancel?: {
    label: string;
    onClick?: () => void;
  };
  confirm: {
    label: string;
    onClick: () => void;
  };
};

export function Confirm({
  action,
  title,
  description,
  cancel,
  confirm,
}: ConfirmProps) {
  return (
    <DialogTrigger>
      <Button {...action} onClick={undefined}>
        <Columns align="center" gap="s" styles={{ background: "transparent" }}>
          <span>{action.label}</span>
          {action.icon && <Icon name={action.icon.name} size="m" />}
        </Columns>
      </Button>
      <Modal className={styles.overlay}>
        <Dialog className={styles.dialog}>
          <Stack gap="m">
            <Columns gap="m" align="center">
              <Icon name="trash" />
              <Heading slot="title" style={{ margin: 0 }}>
                {title}
              </Heading>
            </Columns>
            <Paragraph>{description}</Paragraph>
            <Columns justify="end" gap="s" styles={{ padding: "m" }} wrap>
              {cancel && (
                <Button
                  slot="close"
                  className={classNames(
                    buttonStyles.button,
                    buttonStyles["hasVariant-tertiary"]
                  )}
                  onClick={cancel.onClick}
                >
                  <span>{cancel.label}</span>
                </Button>
              )}
              <Button
                slot="close"
                className={classNames(
                  buttonStyles.button,
                  buttonStyles["hasVariant-primary"]
                )}
                onClick={confirm.onClick}
              >
                <span>{confirm.label}</span>
              </Button>
            </Columns>
          </Stack>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
