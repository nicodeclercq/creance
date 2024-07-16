import { ReactNode } from "react";

import { useModal } from "../../../hooks/useModal";
import { Func } from "../../../utils/functions";
import { Inline } from "../../../shared/layout/inline/inline";
import { ColumnRigid } from "../../../shared/layout/columns/column-rigid";
import { ButtonGhost } from "../button/buttonGhost";
import { Translate } from "../../../shared/translate/translate";
import { Translation } from "../../../@types/translations";
import { ButtonError } from "../button/buttonError";

type Props = {
  action: Translation;
  children: ReactNode;
  trigger: (open: Func<[], void>) => ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
};
export function Confirm({
  children,
  trigger,
  action,
  onCancel,
  onConfirm,
}: Props) {
  const { Modal, setIsOpen } = useModal({
    title: action,
    content: children,
    footer: (
      <Inline spacing="M" justify="END">
        <ColumnRigid>
          <ButtonGhost
            onClick={() => {
              setIsOpen(false);
              if (onCancel) {
                onCancel();
              }
            }}
          >
            <Translate name="cancel" />
          </ButtonGhost>
        </ColumnRigid>
        <ColumnRigid>
          <ButtonError
            onClick={() => {
              setIsOpen(false);
              if (onConfirm) {
                onConfirm();
              }
            }}
          >
            <Translate name={action} />
          </ButtonError>
        </ColumnRigid>
      </Inline>
    ),
    trigger: trigger(() => setIsOpen(true)),
  });
  return <Modal />;
}
