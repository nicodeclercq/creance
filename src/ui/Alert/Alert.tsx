import { type ReactNode } from "react";
import styles from "./Alert.module.css";
import { Icon } from "../Icon/Icon";

type AlertProps = {
  children: ReactNode;
};

export function Alert({ children }: AlertProps) {
  return (
    <div className={styles.alert}>
      <div className={styles.icon}>
        <Icon name="warning" size="l" />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
