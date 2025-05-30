import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import { IconButton, IconButtonProps } from "../IconButton/IconButton";

import { DistributiveOmit } from "../../helpers/DistributiveOmit";
import { Icon } from "../Icon/Icon";
import { IconName } from "../Icon/private";
import buttonStyles from "../Button/Button.module.css";
import classNames from "classnames";
import iconButtonStyles from "../IconButton/IconButton.module.css";
import styles from "./QuickActions.module.css";

export type Action = DistributiveOmit<IconButtonProps, "variant" | "overlays">;

type QuickActionsProps = {
  icon: IconName;
  label: string;
  actions: Action[];
};

export function QuickActions({ icon, label, actions }: QuickActionsProps) {
  return (
    <div className={styles.quickActions}>
      <DialogTrigger>
        <Button
          className={classNames(
            buttonStyles.button,
            iconButtonStyles.button,
            buttonStyles["hasVariant-primary"],
            styles.button
          )}
          aria-label={label}
        >
          <Icon name={icon} size="l" />
        </Button>
        <Popover>
          <Dialog>
            <div className={styles.actionsWrapper}>
              {actions.map((action) => (
                <div key={action.label} className={styles.action}>
                  <span>{action.label}</span>
                  <IconButton {...action} variant="primary" overlays />
                </div>
              ))}
            </div>
          </Dialog>
        </Popover>
      </DialogTrigger>
    </div>
  );
}
