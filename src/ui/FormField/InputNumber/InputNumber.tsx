import { Input } from "react-aria-components";
import { type InputProps } from "../private/InputProps";
import { FormField } from "../FormField";
import styles from "./InputNumber.module.css";
import { useId, useRef } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

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
  ariaLabelledby,
  ...props
}: InputNumberProps<T>) {
  const ref = useRef<HTMLInputElement>(null);
  const id = useId();
  const { t } = useTranslation();

  return (
    <FormField
      data-component="InputNumber"
      id={id}
      {...props}
      ariaLabelledby={ariaLabelledby}
      isDisabled={isDisabled}
      isRequired={isRequired}
    >
      <div
        className={classNames(styles.input, {
          [styles.asNumber]: as === "number",
        })}
      >
        <Input
          ref={ref}
          id={id}
          type="text"
          value={value}
          aria-required={isRequired}
          aria-labelledby={ariaLabelledby}
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
        {as === "number" && (
          <button
            type="button"
            className={styles.decrementButton}
            disabled={isDisabled || ref.current?.value === "0"}
            onClick={() => {
              if (ref.current) {
                const num = Number(ref.current.value);
                const newValue = isNaN(num) ? 0 : num - 1;
                onChange(newValue as T);
                ref.current.value = String(newValue);
              }
            }}
            aria-label={t("component.inputNumber.actions.decrement")}
          >
            -
          </button>
        )}
        {as === "number" && (
          <button
            type="button"
            className={styles.incrementButton}
            disabled={isDisabled}
            onClick={() => {
              if (ref.current) {
                const num = Number(ref.current.value);
                const newValue = isNaN(num) ? 0 : num + 1;
                onChange(newValue as T);
                ref.current.value = String(newValue);
              }
            }}
            aria-label={t("component.inputNumber.actions.increment")}
          >
            +
          </button>
        )}
      </div>
    </FormField>
  );
}
