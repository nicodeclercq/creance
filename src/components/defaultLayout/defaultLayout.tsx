/** @jsxImportSource @emotion/react */
import { ReactNode } from "react";
import { Header } from "../header/header";
import { Container } from "../../shared/layout/container/container";
import { Footer } from "../footer/footer";
import { SPACING } from "../../entities/spacing";
import { Translation } from "../../@types/translations";

type Props = {
  title: Translation;
  children: ReactNode;
};

export function DefaultLayout({ children, title }: Props) {
  return (
    <Container background="GREY_LIGHT" height="100vh">
      <Header title={title} />
      <Container
        paddingY="XXL"
        paddingX="M"
        margin="XXL"
        height="calc(100vh - 8rem)"
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
      <Footer />
    </Container>
  );
}
