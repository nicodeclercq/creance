import { Checkbox as CheckboxCompo } from "react-aria-components";
import styles from "./Checkbox.module.css";

export type CheckboxProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  isRequired?: boolean;
  slot?: never;
};
type ReactAriaCheckBoxProps = {
  slot: string;
};

export function Checkbox(props: CheckboxProps | ReactAriaCheckBoxProps) {
  const {
    value,
    onChange,
    label,
    isRequired = false,
    slot,
  } = props as CheckboxProps;
  return (
    <CheckboxCompo
      data-component="Checkbox"
      className={styles.checkboxWrapper}
      isSelected={value}
      onChange={onChange}
      isRequired={isRequired}
      slot={slot}
    >
      <div className={styles.checkbox} data-is-action={true}>
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <polyline points="1 9 7 14 15 4" />
        </svg>
      </div>
      {label}
    </CheckboxCompo>
  );
}
