import { AsLink, ButtonProps } from "../../../ui/Button/Button";

import { Container } from "../../../ui/Container/Container";
import { DistributiveOmit } from "../../../helpers/DistributiveOmit";
import { Icon } from "../../../ui/Icon/Icon";
import { IconName } from "../../../ui/Icon/private";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { getPath } from "../../../routes";
import styles from "./Menu.module.css";

type Action = DistributiveOmit<ButtonProps<AsLink>, "icon" | "variant"> & {
  icon: IconName;
};

export type MenuProps = {
  gridArea?: string;
  actions: Action[];
};
/*
  border-block-start: 0.1rem solid var(--ui-semantic-color-inverted);
*/
export function Menu({ actions, gridArea }: MenuProps) {
  return (
    <Container
      styles={{
        zIndex: 1,
        gridArea,
        background: "inverted",
        color: "inverted",
        display: "flex",
        position: {
          default: "fixed",
          md: "sticky",
        },
        top: {
          default: "unset",
          md: 0,
        },
        bottom: {
          default: 0,
          md: "unset",
        },
        left: 0,
        right: 0,
        flexDirection: {
          default: "row",
          md: "column",
        },
        height: "max-content",
        alignItems: {
          default: "center",
          md: "stretch",
        },
        justifyContent: "start",
        border: {
          default: {
            top: "inverted",
            right: "none",
          },
          md: {
            top: "none",
            right: "inverted",
          },
        },
        customCSSProperties: {
          "--ui-component-menu-margin-top": {
            default: "0",
            md: "4.8rem",
          },
          "--ui-component-menu-padding-y": {
            default: "var(--ui-semantic-padding-y-xs)",
            md: "var(--ui-semantic-padding-y-l)",
          },
          "--ui-component-menu-border-active-bottom": {
            default: "0.4rem solid currentColor",
            md: "none",
          },
          "--ui-component-menu-border-active-left": {
            default: "none",
            md: "0.8rem solid currentColor",
          },
        },
      }}
    >
      {actions.map(({ icon, ...action }) => (
        <NavLink
          key={action.to}
          to={getPath(action.to, action.params, action.hash)}
          className={({ isActive }) =>
            classNames(styles.link, { [styles.isActive]: isActive })
          }
        >
          <Icon name={icon} size="s" />
          <span>{action.label}</span>
        </NavLink>
      ))}
    </Container>
  );
}
