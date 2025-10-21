import { type ReactNode } from "react";
import { Dialog, Modal as RAModal, ModalOverlay } from "react-aria-components";
import { Heading } from "../Heading/Heading";
import styles from "./Modal.module.css";

type ModalProps = {
  children: ReactNode;
  title: string;
  isOpen: boolean;
};

export function Modal({ children, title, isOpen }: ModalProps) {
  return (
    <ModalOverlay
      data-component="Modal"
      isDismissable
      isOpen={isOpen}
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
