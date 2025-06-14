import { Container } from "../../ui/Container/Container";
import { type ReactNode } from "react";
import { Stack } from "../../ui/Stack/Stack";
import { Columns } from "../../ui/Columns/Columns";
import { Heading } from "../../ui/Heading/Heading";
import type { IconButtonProps, AsLink } from "../../ui/IconButton/IconButton";
import { IconButton } from "../../ui/IconButton/IconButton";
import { Menu, MenuProps } from "./Menu/Menu";

type PageTemplateProps = {
  title: string;
  children: ReactNode;
  leftAction?: Omit<IconButtonProps<AsLink>, "variant">;
  menu?: MenuProps["actions"];
};

export function PageTemplate({
  leftAction,
  children,
  title,
  menu,
}: PageTemplateProps) {
  return (
    <Stack>
      <Container
        styles={{
          padding: "m",
          background: "inverted",
          color: "inverted",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Columns gap="s" styles={{ background: "transparent" }} align="center">
          {leftAction && <IconButton {...leftAction} variant="primary" />}
          <Heading styles={{ font: "body-large", color: "inverted" }}>
            {title}
          </Heading>
        </Columns>
      </Container>
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
