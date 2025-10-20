import classNames from "classnames";
import { Button } from "react-aria-components";
import { AsButton, AsLink, type ButtonProps } from "../Button/Button";
import { DistributiveOmit } from "../../helpers/DistributiveOmit";
import { Columns } from "../Columns/Columns";
import { Link } from "react-router-dom";
import { getPath } from "../../routes";
import styles from "./ContextualMenu.module.css";
import { entries } from "../../utils/object";
import { Icon } from "../Icon/Icon";

type Action =
  | DistributiveOmit<ButtonProps<AsLink>, "icon">
  | DistributiveOmit<ButtonProps<AsButton>, "icon" | "variant">;

export type ContextualMenuProps<Actions extends Record<string, Action>> = {
  currentAction: keyof Actions;
  actions: Actions;
};

export function ContextualMenu<Actions extends Record<string, Action>>({
  actions,
  currentAction,
}: ContextualMenuProps<Actions>) {
  return (
    <div className={styles.ContextualMenu}>
      <Columns align="stretch">
        {entries(actions).map(([key, actionProps]) => {
          const { label, ...action } = actionProps as Action;
          const content = (
            <Columns gap="s" align="center" justify="center">
              <span
                style={{
                  display: currentAction === key ? "inline-flex" : "none",
                }}
              >
                <Icon name="check" size="s" />
              </span>
              <span style={{ flexGrow: 1 }}>{label}</span>
            </Columns>
          );

          return action.as === "link" ? (
            <Link
              key={key as string}
              className={classNames(styles.action, {
                [styles.isActive]: currentAction === key,
              })}
              {...action}
              to={getPath(action.to, action.params)}
            >
              {content}
            </Link>
          ) : (
            <Button
              key={label}
              className={classNames(styles.action, {
                [styles.isActive]: currentAction === key,
              })}
              {...action}
              onClick={action.onClick}
            >
              {content}
            </Button>
          );
        })}
      </Columns>
    </div>
  );
}
