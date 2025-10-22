import { type ReactNode } from "react";
import { Dialog, Modal as RAModal, ModalOverlay } from "react-aria-components";
import { Heading } from "../Heading/Heading";
import styles from "./Modal.module.css";

type ModalProps = {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  isDismissable?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export function Modal({ children, title, isOpen, isDismissable = true, onOpenChange }: ModalProps) {
  return (
    <ModalOverlay
      data-component="Modal"
      isDismissable={isDismissable}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={styles.overlay}
    >
      <RAModal className={styles.modal}>
        <Dialog>
          <Heading level={2} styles={{ font: "body-large" }}>
            {title}
          </Heading>
          {children}
        </Dialog>
      </RAModal>
    </ModalOverlay>
  );
}
