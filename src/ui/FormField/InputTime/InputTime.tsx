import {
  DateSegment,
  DateInput,
  Label,
  TimeField,
  FieldError,
  Text,
  Group,
} from "react-aria-components";
import { Time } from "@internationalized/date";
import { type InputProps } from "../private/InputProps";
import { useId, useRef } from "react";
import styles from "./InputTime.module.css";
import formFieldStyles from "../FormField.module.css";
import labelStyles from "../Label/Label.module.css";
import classNames from "classnames";

export type InputTimeProps<T extends string | number> = Omit<
  InputProps<"number", T>,
  "type" | "value" | "onChange"
> & {
  value: string;
  onChange: (newValue: string) => void;
};

const fromTimeValue = (value: Time | null) => {
  return value == null ? "" : `${value.hour}:${value.minute}`;
};
const toTimeValue = (value: string): Time | null => {
  const parts = (value ?? "").split(":");
  const hours = Number.parseInt(parts[0], 10);
  const minutes = Number.parseInt(parts[1], 10);
  return parts.length !== 2 ? null : new Time(hours, minutes);
};

export function InputTime<T extends string | number = string>({
  value,
  label,
  message,
  onChange,
  onBlur,
  isRequired = false,
  isDisabled = false,
  ariaLabelledby,
}: InputTimeProps<T>) {
  const ref = useRef<HTMLInputElement>(null);
  const id = useId();

  return (
    <TimeField
      className={classNames(formFieldStyles.formField, {
        [formFieldStyles.isDisabled]: isDisabled,
      })}
      data-component="InputTime"
      ref={ref}
      value={toTimeValue(value)}
      onChange={(newValue) => {
        onChange(fromTimeValue(newValue));
      }}
      onBlur={() => {
        onBlur?.(value as T);
      }}
      id={id}
      aria-labelledby={ariaLabelledby}
      isDisabled={isDisabled}
      isRequired={isRequired}
    >
      <Label className={labelStyles.label}>{label}</Label>
      <Group className={styles.group}>
        <DateInput>
          {(segment) => (
            <DateSegment segment={segment} className={styles.segment} />
          )}
        </DateInput>
      </Group>
      {message && <Text slot="description">{message}</Text>}
      <FieldError />
    </TimeField>
  );
}
