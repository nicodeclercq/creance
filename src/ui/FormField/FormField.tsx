import { Text } from "react-aria-components";
import classNames from "classnames";
import styles from "./FormField.module.css";
import { type ReactNode } from "react";
import { ErrorMessage } from "./ErrorMessage/ErrorMessage";
import { Label } from "./Label/Label";

export type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  isRequired: boolean;
  isDisabled: boolean;
  children: ReactNode;
  message?: string;
};

export function FormField({
  id,
  label: providedLabel,
  error,
  children,
  isRequired = false,
  isDisabled = false,
  message,
}: FormFieldProps) {
  const label = isRequired ? providedLabel : `${providedLabel} (optionel)`;

  return (
    <div
      className={classNames(styles.formField, {
        [styles.isInvalid]: error != null,
        [styles.isDisabled]: isDisabled,
      })}
    >
      <Label htmlFor={id}>{label}</Label>
      {children}
      <Text slot="description" />
      {error && <ErrorMessage id={`${id}_error`} message={error} />}
      {message && (
        <span id={`${id}_message`} className={styles.message}>
          {message}
        </span>
      )}
    </div>
  );
}
