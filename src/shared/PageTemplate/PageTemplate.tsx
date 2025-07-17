import { Container } from "../../ui/Container/Container";
import { type ReactNode } from "react";
import { Stack } from "../../ui/Stack/Stack";
import type {
  AsLink,
  AsButton,
  IconButtonPropsWhithoutVariantAndOverlays,
} from "../../ui/IconButton/IconButton";

import { Menu, MenuProps } from "./Menu/Menu";
import { Header, HeaderProps } from "./Header";
import { RouteName } from "../../routes";

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
    <Stack>
      <Header
        leftAction={leftAction}
        title={title}
        rightActions={rightActions}
      />
      {menu && <Menu actions={menu} />}
      <Container styles={{ padding: "m" }}>{children}</Container>
      <div style={{ height: "15rem" }}>
        {/* Reserved place to ensure Quick Action doesn't overlap content */}
      </div>
    </Stack>
  );
}
