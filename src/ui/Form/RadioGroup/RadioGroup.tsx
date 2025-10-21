import { RadioGroup as Group, Radio } from "react-aria-components";
import { FormField } from "../../FormField/FormField";
import classNames from "classnames";
import styles from "./RadioGroup.module.css";
import { useId } from "react";
type Option<T> = { id: string; label: string; value: T };

type RadioGroupProps<T> = {
  label: string;
  value: T;
  onChange: (value: T) => void;
  isRequired?: boolean;
  isDisabled?: boolean;
  error?: string | undefined;
  options: Option<T>[];
  wrap?: boolean;
};

export function RadioGroup<T>({
  label,
  error,
  value,
  onChange,
  options,
  isDisabled = false,
  isRequired = false,
  wrap = false,
}: RadioGroupProps<T>) {
  const id = useId();
  const selectedOption = options.find((option) => option.id === value);
  const change = (newValue: string) => {
    const newOption = options.find((option) => option.id === newValue);
    if (newOption) {
      onChange(newOption.value);
    }
  };

  return (
    <FormField
      data-component="RadioGroup"
      id={id}
      label={label}
      isRequired={isRequired}
      isDisabled={isDisabled}
      error={error}
    >
      <Group
        value={selectedOption?.id}
        onChange={change}
        className={classNames(styles.group, { [styles.wrap]: wrap })}
        aria-labelledby={id}
      >
        {options.map(({ label, id }) => (
          <Radio key={id} value={id} className={styles.radio}>
            {label}
          </Radio>
        ))}
      </Group>
    </FormField>
  );
}
