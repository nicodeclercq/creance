import { ReactNode, useState } from "react";
import { Container } from "../shared/layout/container/container";
import { Columns } from "../shared/layout/columns/columns";
import { ColumnFlexible } from "../shared/layout/columns/column-flexible";
import { ColumnRigid } from "../shared/layout/columns/column-rigid";
import { ButtonGhost } from "../shared/library/button/buttonGhost";
import { Icon, ICONS } from "../shared/library/icon/icon";

type Props = {
  title: ReactNode;
  children: ReactNode;
};

export function Accordion({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container>
      <Columns spacing="M">
        <ColumnFlexible>{title}</ColumnFlexible>
        <ColumnRigid>
          <ButtonGhost
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            <Icon name={isOpen ? ICONS.CHEVRON_UP : ICONS.CHEVRON_DOWN} />
          </ButtonGhost>
        </ColumnRigid>
      </Columns>
      {isOpen && <Container paddingY="M">{children}</Container>}
    </Container>
  );
}
