import { type ReactNode } from "react";
import classNames from "classnames";
import styles from "./Alert.module.css";
import { Icon } from "../Icon/Icon";

type AlertProps = {
  children: ReactNode;
  type?: "prominent" | "subtle";
};

export function Alert({ children, type = "prominent" }: AlertProps) {
  return (
    <div
      className={classNames(styles.alert, styles[`type-${type}`])}
      data-component="Alert"
    >
      <div className={styles.icon}>
        <Icon name="warning" size={type === "prominent" ? "l" : "m"} />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
