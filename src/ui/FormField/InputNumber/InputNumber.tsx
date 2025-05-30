import { Input } from "react-aria-components";
import { type InputProps } from "../private/InputProps";
import { FormField } from "../FormField";
import styles from "./InputNumber.module.css";
import { useId } from "react";

export type InputNumberProps<T extends string | number> = InputProps<
  "number",
  T
> & { as: T extends string ? "string" : "number" } & {
  unit?: string;
};

export function InputNumber<T extends string | number = string>({
  as = "string" as T extends string ? "string" : "number",
  type,
  value,
  onChange,
  isRequired = false,
  isDisabled = false,
  unit,
  ...props
}: InputNumberProps<T>) {
  const id = useId();

  return (
    <FormField
      id={id}
      {...props}
      isDisabled={isDisabled}
      isRequired={isRequired}
    >
      <div className={styles.input}>
        <Input
          id={id}
          type="text"
          value={value}
          aria-required={isRequired}
          disabled={isDisabled}
          onKeyDown={(event) => {
            // Replace ',' with '.' to limit casting errors
            if (event.key === ",") {
              event.preventDefault();
              const input = event.target as HTMLInputElement;
              const start = input.selectionStart || 0;
              const end = input.selectionEnd || 0;

              input.setRangeText(".", start, end, "end");
            }
          }}
          onChange={(event) => {
            const num = Number(event.target.value);

            onChange(
              (as === "string" ? event.target.value : isNaN(num) ? 0 : num) as T
            );
          }}
          inputMode="numeric"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
    </FormField>
  );
}
