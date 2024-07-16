import { ReactNode } from "react";

import { Stack } from "../../shared/layout/stack/stack";
import { Container } from "../../shared/layout/container/container";
import { Translation } from "../../@types/translations";
import { Translate } from "../../shared/translate/translate";
import { Title } from "../../shared/library/text/title/title";
import { Columns } from "../../shared/layout/columns/columns";
import { ColumnRigid } from "../../shared/layout/columns/column-rigid";
import { ColumnFlexible } from "../../shared/layout/columns/column-flexible";
import { useRoute } from "../../hooks/useRoute";
import { ButtonGhost } from "../../shared/library/button/buttonGhost";

type Props = {
  title: Translation;
  children: ReactNode;
};

export function FormLayout({ title, children }: Props) {
  const { back } = useRoute();

  return (
    <Container background="WHITE" height="100vh">
      <Stack>
        <Container
          paddingY="XL"
          paddingX="M"
          zIndex="header"
          borderBottom="LIGHT"
        >
          <Columns align="CENTER" spacing="M">
            <ColumnRigid>
              <ButtonGhost iconLeft="CHEVRON_LEFT" onClick={back}>
                <Translate name="navigation.back" />
              </ButtonGhost>
            </ColumnRigid>
            <ColumnFlexible>
              <Title>
                <Translate name={title} />
              </Title>
            </ColumnFlexible>
          </Columns>
        </Container>
        <Container paddingY="XL" paddingX="M" scroll grow shrink zIndex="main">
          {children}
        </Container>
      </Stack>
    </Container>
  );
}
