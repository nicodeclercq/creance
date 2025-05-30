import { AsLink, ButtonProps } from "../../../ui/Button/Button";

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
  actions: Action[];
};

export function Menu({ actions }: MenuProps) {
  return (
    <div className={styles.menu}>
      {actions.map(({ icon, ...action }) => (
        <NavLink
          key={action.label}
          to={getPath(action.to, action.params)}
          className={({ isActive }) =>
            classNames(styles.link, { [styles.isActive]: isActive })
          }
        >
          <Icon name={icon} size="s" />
          <span>{action.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
