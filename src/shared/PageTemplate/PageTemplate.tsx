import { Container } from "../../ui/Container/Container";
import { type ReactNode } from "react";
import { Stack } from "../../ui/Stack/Stack";
import type {
  IconButtonProps,
  AsLink,
  AsButton,
} from "../../ui/IconButton/IconButton";

import { Menu, MenuProps } from "./Menu/Menu";
import { Header, HeaderProps } from "./Header";

type PageTemplateProps = {
  title: string;
  children: ReactNode;
  leftAction?:
    | Omit<IconButtonProps<AsLink>, "variant">
    | Omit<IconButtonProps<AsButton>, "variant">;
  rightActions?: HeaderProps["rightActions"];
  menu?: MenuProps["actions"];
};

export function PageTemplate({
  leftAction,
  rightActions,
  children,
  title,
  menu,
}: PageTemplateProps) {
  return (
    <Stack>
      <Header
        leftAction={leftAction}
        title={title}
        rightActions={rightActions}
      />
      {menu && <Menu actions={menu} />}
      <Container styles={{ padding: "m", background: "transparent" }}>
        {children}
      </Container>
      <div style={{ height: "15rem" }}>
        {/* Reserved place to ensure Quick Action doesn't overlap content */}
      </div>
    </Stack>
  );
}
