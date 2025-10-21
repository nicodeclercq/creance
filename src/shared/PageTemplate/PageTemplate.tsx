import { type ReactNode } from "react";
import { Container } from "../../ui/Container/Container";
import type {
  AsLink,
  AsButton,
  IconButtonPropsWhithoutVariantAndOverlays,
} from "../../ui/IconButton/IconButton";
import type { MenuProps } from "./Menu/Menu";
import { Menu } from "./Menu/Menu";
import type { HeaderProps } from "./Header";
import { Header } from "./Header";
import type { RouteName } from "../../routes";
import { Logo } from "../../ui/Logo/Logo";
import { MediaOnly } from "../../ui/MediaOnly/MediaOnly";

type PageTemplateProps<R extends RouteName> = {
  title: string;
  children: ReactNode;
  leftAction?: IconButtonPropsWhithoutVariantAndOverlays<AsLink<R> | AsButton>;
  rightActions?: HeaderProps["rightActions"];
  menu?: MenuProps["actions"];
};

export function PageTemplate<R extends RouteName>({
  leftAction,
  rightActions,
  children,
  title,
  menu,
}: PageTemplateProps<R>) {
  return (
    <Container
      styles={{
        display: "grid",
        justifyContent: "center",
        background: "inverted",
        height: "100vh",
        gridTemplateRows: {
          default: ["max-content", "1fr", "max-content"],
          md: ["max-content", "1fr"],
        },
        gridTemplateColumns: {
          default: 1,
          md: ["max-content", "1fr"],
        },
        gridTemplateAreas: {
          default: '"header" "content" "menu"',
          md: '"logo header" "menu content"',
        },
      }}
    >
      <MediaOnly
        media="md"
        styles={{
          padding: "s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "s",
          gridArea: "logo",
          color: "inverted",
        }}
      >
        <Logo size="l" show="text" />
      </MediaOnly>
      <MediaOnly
        media={["lg", "xl"]}
        styles={{
          padding: "s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "s",
          gridArea: "logo",
          color: "inverted",
        }}
      >
        <Logo size="l" show="both" />
      </MediaOnly>
      <Header
        leftAction={leftAction}
        title={title}
        rightActions={rightActions}
        gridArea="header"
      />
      {menu && <Menu actions={menu} gridArea="menu" />}
      <Container
        styles={{
          padding: "m",
          gridArea: "content",
          background: "body",
          height: "100%",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Container styles={{ width: "100%", maxWidth: "80rem" }}>
          {children}
          <Container styles={{ height: "15rem" }}>
            {/* Reserved place to ensure Quick Action doesn't overlap content */}
          </Container>
        </Container>
      </Container>
    </Container>
  );
}
