import {
  Button,
  CalendarCell,
  CalendarGrid,
  Heading,
  RangeCalendar,
} from "react-aria-components";
import { type ZonedDateTime, fromDate } from "@internationalized/date";
import classNames from "classnames";

import { InputProps } from "../private/InputProps";
import { FormField } from "../FormField";
import { useId } from "react";
import styles from "./CalendarRangePicker.module.css";
import buttonStyles from "../../Button/Button.module.css";
import iconButtonStyles from "../../IconButton/IconButton.module.css";
import { Icon } from "../../Icon/Icon";

export type CalendarRangePickerProps = InputProps<
  "calendar-range-picker",
  { start: Date; end: Date }
> & {
  min?: Date;
  max?: Date;
};

export function CalendarRangePicker({
  type: _type,
  value,
  onChange,
  isRequired = false,
  isDisabled = false,
  min,
  max,
  ...props
}: CalendarRangePickerProps) {
  const id = useId();

  const start = fromDate(new Date(value?.start), "UTC");
  const end = fromDate(new Date(value?.end), "UTC");

  const change = (newValue: { start: ZonedDateTime; end: ZonedDateTime }) => {
    const start = new Date(
      newValue.start.year,
      newValue.start.month - 1,
      newValue.start.day + 1
    );
    const end = new Date(
      newValue.end.year,
      newValue.end.month - 1,
      newValue.end.day + 1
    );
    onChange({ start, end });
  };

  return (
    <FormField
      {...props}
      id={id}
      isDisabled={isDisabled}
      isRequired={isRequired}
    >
      <RangeCalendar
        className={styles.calendar}
        value={{ start, end }}
        onChange={change}
        {...props}
        minValue={min ? fromDate(new Date(min), "UTC") : undefined}
        maxValue={max ? fromDate(new Date(max), "UTC") : undefined}
      >
        <header className={styles.header}>
          <Button
            slot="previous"
            className={classNames(
              styles.button,
              buttonStyles.button,
              buttonStyles["hasVariant-tertiary"],
              iconButtonStyles.button
            )}
          >
            <Icon name="chevron-left" />
          </Button>
          <Heading className={styles.title} />
          <Button
            slot="next"
            className={classNames(
              styles.button,
              buttonStyles.button,
              buttonStyles["hasVariant-tertiary"],
              iconButtonStyles.button
            )}
          >
            <Icon name="chevron-right" />
          </Button>
        </header>
        <CalendarGrid className={styles.calendarGrid}>
          {(date) => (
            <CalendarCell className={styles.calendarCell} date={date} />
          )}
        </CalendarGrid>
      </RangeCalendar>
    </FormField>
  );
}
