import classNames from "classnames";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import { Icon } from "../Icon/Icon";
import { AsButton, AsLink, type ButtonProps } from "../Button/Button";
import styles from "./Menu.module.css";
import buttonStyles from "../Button/Button.module.css";
import iconButtonStyles from "../IconButton/IconButton.module.css";
import { type IconName } from "../Icon/private";
import { DistributiveOmit } from "../../helpers/DistributiveOmit";
import { Stack } from "../Stack/Stack";
import { Columns } from "../Columns/Columns";
import { Link } from "react-router-dom";
import { getPath } from "../../routes";
import { Confirm, ConfirmProps } from "../Confirm/Confirm";

type Action =
  | (DistributiveOmit<ButtonProps<AsLink>, "icon"> & {
      icon: IconName;
    })
  | (DistributiveOmit<ButtonProps<AsButton>, "icon" | "variant"> & {
      icon: IconName;
      confirmation?: DistributiveOmit<ConfirmProps, "action">;
    });

export type MenuProps = {
  label: string;
  variant?: "primary" | "secondary" | "tertiary";
  icon?: IconName;
  actions: Action[];
};

export function Menu({
  label,
  icon = "menu",
  variant = "tertiary",
  actions,
}: MenuProps) {
  return (
    <DialogTrigger>
      <Button
        className={classNames(
          buttonStyles.button,
          iconButtonStyles.button,
          buttonStyles[`hasVariant-${variant}`]
        )}
        aria-label={label}
      >
        <Icon name={icon} />
      </Button>
      <Popover>
        <Dialog className={styles.menu}>
          <Stack alignItems="stretch">
            {actions.map(({ label, icon, ...action }) => {
              const content = (
                <Columns
                  styles={{ background: "transparent" }}
                  gap="s"
                  align="center"
                >
                  <span style={{ flexGrow: 1 }}>{label}</span>
                  <Icon name={icon} />
                </Columns>
              );

              return action.as === "link" ? (
                <Link
                  key={label}
                  className={styles.action}
                  {...action}
                  to={getPath(action.to, action.params)}
                >
                  {content}
                </Link>
              ) : action.confirmation ? (
                <Confirm
                  key={label}
                  {...action.confirmation}
                  action={{
                    className: styles.action,
                    icon: {
                      name: icon,
                      position: "end",
                    },
                    label,
                    onClick: action.onClick,
                  }}
                />
              ) : (
                <Button
                  key={label}
                  className={styles.action}
                  {...action}
                  onClick={action.onClick}
                >
                  {content}
                </Button>
              );
            })}
          </Stack>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
