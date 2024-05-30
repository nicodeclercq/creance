import { ReactNode, useRef } from "react";
import { useClickAway, useCss } from "react-use";

import { SPACING } from "../../../entities/spacing";
import { COLOR } from "../../../entities/color";
import { RADIUS } from "../../../entities/radius";
import { Translation } from "../../../@types/translations";
import { Title } from "../text/title/title";
import { Translate } from "../../../shared/translate/translate";
import { Columns } from "../../../shared/layout/columns/columns";
import { ColumnFlexible } from "../../../shared/layout/columns/column-flexible";
import { Container } from "../../../shared/layout/container/container";
import { ColumnRigid } from "../../../shared/layout/columns/column-rigid";
import { ButtonGhost } from "../button/buttonGhost";
import { Icon } from "../icon/icon";
import { toCssValue } from "../../../entities/color";

type Props = {
  children: ReactNode;
  title: Translation | ReactNode;
  onClose?: () => boolean | void;
  hasCloseButton?: boolean;
  footer?: ReactNode;
  isFull?: boolean;
};

export function Modal({
  children,
  title,
  onClose,
  hasCloseButton,
  footer,
  isFull = false,
}: Props) {
  const ref = useRef(null);
  const noop = () => {};
  useClickAway(ref, onClose || noop);

  const wrapperStyle = useCss({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: toCssValue("OVERLAY"),
    padding: SPACING.M,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  });
  const modalContainerStyle = useCss({
    minWidth: "80vw",
    maxWidth: `calc(100vw - ${SPACING.XS} * 2)`,
    height: isFull
      ? `calc(100vh -  ${SPACING.XS} * 2);`
      : `max-height: calc(100vh -  ${SPACING.XS} * 2);`,
    overflow: "hidden",
    "& > *": {
      width: "100%",
      height: "100%",
      overflowY: "auto",
    },
  });
  const modalStyle = useCss({
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr) auto",
    gridGap: SPACING.M,
    height: "100%",
    background: toCssValue(COLOR.WHITE),
    padding: SPACING.M,
    borderRadius: RADIUS.default,
  });

  return (
    <div className={wrapperStyle}>
      <div ref={ref} className={modalContainerStyle}>
        <div className={modalStyle}>
          <Container borderBottom="DEFAULT" paddingY="S">
            <Columns spacing="M">
              <ColumnFlexible>
                <Title>
                  {typeof title === "string" ? (
                    <Translate name={title as Translation} />
                  ) : (
                    title
                  )}
                </Title>
              </ColumnFlexible>
              {onClose && hasCloseButton && (
                <ColumnRigid>
                  <ButtonGhost onClick={onClose}>
                    <Icon name="CROSS" />
                  </ButtonGhost>
                </ColumnRigid>
              )}
            </Columns>
          </Container>
          <Container scroll>{children}</Container>
          {footer && <Container>{footer}</Container>}
        </div>
      </div>
    </div>
  );
}
