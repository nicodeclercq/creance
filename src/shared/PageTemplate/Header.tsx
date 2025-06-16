import { useTranslation } from "react-i18next";
import type { AsButton, AsLink } from "../../ui/IconButton/IconButton";
import { Columns } from "../../ui/Columns/Columns";
import { Container } from "../../ui/Container/Container";
import { Heading } from "../../ui/Heading/Heading";
import {
  IconButton,
  type IconButtonProps,
} from "../../ui/IconButton/IconButton";
import { Menu, type MenuProps } from "../../ui/Menu/Menu";

export type HeaderProps = {
  leftAction?:
    | Omit<IconButtonProps<AsLink>, "variant">
    | Omit<IconButtonProps<AsButton>, "variant">;
  title: string;
  rightActions?: MenuProps["actions"];
};

export function Header({ leftAction, title, rightActions }: HeaderProps) {
  const { t } = useTranslation();

  return (
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
        <Heading
          styles={{ font: "body-large", color: "inverted", flexGrow: true }}
        >
          {title}
        </Heading>
        {rightActions && (
          <Menu
            label={t("component.pageTemplate.actions.more")}
            variant="primary"
            icon="menu"
            actions={rightActions}
          />
        )}
      </Columns>
    </Container>
  );
}
