import { ReactNode, useState } from "react";
import usePortal from "react-useportal";

import { Modal } from "../shared/library/modal/modal";
import { Theme } from "../shared/theme/theme";
import { Translation } from "../@types/translations";

type Props = {
  content: ReactNode;
  trigger?: ReactNode;
  title: Translation | ReactNode;
  beforeClose?: () => boolean | void;
  hasCloseButton?: boolean;
  footer?: ReactNode;
  isFull?: boolean;
};

const handleBlurEffect = (isOpen: boolean) => {
  const root = document.getElementById("root");

  if (root) {
    if (isOpen) {
      root.style.filter = `blur(2px)`;
    } else {
      root.style.filter = "";
    }
  }
};

export const useModal = ({
  content,
  trigger,
  title,
  beforeClose = () => true,
  hasCloseButton,
  footer,
  isFull,
}: Props) => {
  const { Portal } = usePortal();
  const [isOpen, setIsOpen] = useState(!trigger);

  const openClose = (newValue: boolean) => {
    handleBlurEffect(!isOpen);
    setIsOpen(newValue);
  };

  handleBlurEffect(isOpen);

  const ModalTrigger = () => (
    <>
      {trigger}
      {isOpen && (
        <Portal>
          <Theme>
            <Modal
              title={title}
              onClose={() => {
                const res = beforeClose();
                if (res == null || res !== false) {
                  setIsOpen(false);
                }
              }}
              hasCloseButton={hasCloseButton}
              footer={footer}
              isFull={isFull}
            >
              {content}
            </Modal>
          </Theme>
        </Portal>
      )}
    </>
  );

  return { Modal: ModalTrigger, isOpen, setIsOpen: openClose } as const;
};
