import { Icon } from "../../Icon/Icon";
import styles from "./ErrorMessage.module.css";

type ErrorMessageProps = {
  id?: string;
  message: string;
};

export function ErrorMessage({ id, message }: ErrorMessageProps) {
  return (
    <span data-component="ErrorMessage" id={id} className={styles.error}>
      <Icon name="error" size="s" /> {message}
    </span>
  );
}
