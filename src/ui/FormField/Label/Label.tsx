import { Label as RALabel } from "react-aria-components";
import styles from "./Label.module.css";

type LabelProps = {
  htmlFor: string;
  children: string;
};

export function Label({ htmlFor, children }: LabelProps) {
  return (
    <RALabel data-component="Label" className={styles.label} htmlFor={htmlFor}>
      {children}
    </RALabel>
  );
}
