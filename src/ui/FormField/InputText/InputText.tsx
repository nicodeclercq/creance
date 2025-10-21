import { Input } from "react-aria-components";
import { type InputProps } from "../private/InputProps";
import { FormField } from "../FormField";
import styles from "./InputText.module.css";
import { useId } from "react";
export type InputTextProps = InputProps<"text" | "email", string>;

export function InputText({
  type,
  value,
  onChange,
  onBlur,
  isRequired = false,
  isDisabled = false,
  ...props
}: InputTextProps) {
  const id = useId();

  return (
    <FormField
      data-component="InputText"
      id={id}
      {...props}
      isDisabled={isDisabled}
      isRequired={isRequired}
    >
      <Input
        id={id}
        className={styles.input}
        type={type}
        value={value}
        aria-required={isRequired}
        disabled={isDisabled}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onBlur={(event) => {
          onBlur?.(event.target.value);
        }}
      />
    </FormField>
  );
}
