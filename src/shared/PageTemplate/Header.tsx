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
import { useCurrentUser } from "../../store/useCurrentUser";
import { Avatar } from "../../ui/Avatar/Avatar";

export type HeaderProps = {
  gridArea?: string;
  leftAction?:
    | Omit<IconButtonProps<AsLink>, "variant">
    | Omit<IconButtonProps<AsButton>, "variant">;
  title: string;
  rightActions?: MenuProps["actions"];
};

export const HEADER_HEIGHT = "9rem";

export function Header({
  leftAction,
  title,
  rightActions,
  gridArea,
}: HeaderProps) {
  const { t } = useTranslation();
  const { currentUser } = useCurrentUser();

  return (
    <Container
      styles={{
        padding: "m",
        background: "inverted",
        color: "inverted",
        position: "sticky",
        top: 0,
        zIndex: 100,
        gridArea,
      }}
    >
      <Columns gap="m" align="center">
        {leftAction && <IconButton {...leftAction} variant="primary" />}
        <Heading
          styles={{ font: "body-large", color: "inverted", flexGrow: true }}
        >
          {title}
        </Heading>
        {currentUser && (
          <Avatar
            label={currentUser.name}
            image={currentUser.avatar}
            size="m"
          />
        )}
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
