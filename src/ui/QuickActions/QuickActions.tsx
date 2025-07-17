import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import {
  IconButton,
  type IconButtonPropsWhithoutVariantAndOverlays,
  type AsButton,
  type AsLink,
} from "../IconButton/IconButton";

import { Icon } from "../Icon/Icon";
import { IconName } from "../Icon/private";
import buttonStyles from "../Button/Button.module.css";
import classNames from "classnames";
import iconButtonStyles from "../IconButton/IconButton.module.css";
import styles from "./QuickActions.module.css";
import { RouteName } from "../../routes";

export type Action<R extends RouteName> =
  IconButtonPropsWhithoutVariantAndOverlays<AsLink<R> | AsButton>;

type QuickActionsProps<R extends RouteName> = {
  icon: IconName;
  label: string;
  actions: Action<R>[];
};

export function QuickActions<R extends RouteName>({
  icon,
  label,
  actions,
}: QuickActionsProps<R>) {
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
                  <IconButton
                    {...(action as IconButtonPropsWhithoutVariantAndOverlays<AsButton>)}
                    variant="primary"
                    overlays
                  />
                </div>
              ))}
            </div>
          </Dialog>
        </Popover>
      </DialogTrigger>
    </div>
  );
}
