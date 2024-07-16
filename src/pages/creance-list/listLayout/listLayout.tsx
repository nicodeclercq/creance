import { ReactNode } from "react";
import { Container } from "../../../shared/layout/container/container";
import { SPACING } from "../../../entities/spacing";
import { Inline } from "../../../shared/layout/inline/inline";
import { ColumnFlexible } from "../../../shared/layout/columns/column-flexible";
import { Title } from "../../../shared/library/text/title/title";
import { Translate } from "../../../shared/translate/translate";

function Header() {
  return (
    <Container
      position="fixed"
      width="100%"
      top={0}
      left={0}
      padding="M"
      background="PRIMARY_DARK"
      foreground="WHITE"
      shadow="M"
      zIndex="header"
    >
      <Inline spacingX="M" justify="SPACE_BETWEEN">
        <ColumnFlexible>
          <Title>
            <Translate name="page.list" />
          </Title>
        </ColumnFlexible>
      </Inline>
    </Container>
  );
}

type Props = {
  children: ReactNode;
};

export function ListLayout({ children }: Props) {
  return (
    <Container background="GREY_LIGHT" height="100vh">
      <Header />
      <Container
        paddingY="XXL"
        paddingX="M"
        margin="XXL"
        scroll
        grow
        zIndex="main"
      >
        <div
          style={{
            marginBottom: SPACING.XL,
          }}
        >
          {children}
        </div>
      </Container>
    </Container>
  );
}
