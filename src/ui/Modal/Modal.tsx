import { type ReactNode } from "react";
import { Dialog, Modal as RAModal, ModalOverlay } from "react-aria-components";
import { Heading } from "../Heading/Heading";
import styles from "./Modal.module.css";
import { Heading as RAHeading } from "react-aria-components";
import { Span } from "../Span/Span";

type ModalProps = {
  children: ReactNode;
  title: string;
  isOpen: boolean;
  isDismissable?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
};

export function Modal({
  children,
  title,
  isOpen,
  isDismissable = true,
  onOpenChange,
}: ModalProps) {
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
          <RAHeading slot="title">
            <Span styles={{ font: "body-large" }}>{title}</Span>
          </RAHeading>
          {children}
        </Dialog>
      </RAModal>
    </ModalOverlay>
  );
}
