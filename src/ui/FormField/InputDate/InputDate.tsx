import {
  DateField,
  DateInput,
  DateSegment,
  Group,
} from "react-aria-components";

import { FormField } from "../FormField";
import { InputProps } from "../private/InputProps";
import { fromDate } from "@internationalized/date";
import styles from "./InputDate.module.css";
import { useId } from "react";

export type InputDateProps = InputProps<"date", Date>;

export function InputDate({
  type,
  value,
  onChange,
  isRequired = false,
  isDisabled = false,
  ...props
}: InputDateProps) {
  const id = useId();

  return (
    <FormField
      id={id}
      {...props}
      isDisabled={isDisabled}
      isRequired={isRequired}
    >
      <DateField
        value={fromDate(value, "UTC")}
        granularity="day"
        onChange={(a) => {
          if (a != null) onChange(a.toDate());
        }}
        {...props}
      >
        <Group className={styles.group}>
          <DateInput className={styles.input}>
            {(segment) => (
              <DateSegment className={styles.segment} segment={segment} />
            )}
          </DateInput>
        </Group>
      </DateField>
    </FormField>
  );
}
