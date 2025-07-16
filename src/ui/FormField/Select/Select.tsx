import { useId, type ReactNode } from "react";
import {
  ListBox,
  Popover,
  Select as RASelect,
  Button,
  type ListBoxItemProps,
  ListBoxItem,
  Key,
  TooltipTrigger,
  Tooltip,
} from "react-aria-components";
import { Icon } from "../../Icon/Icon";
import styles from "./Select.module.css";
import classNames from "classnames";
import { Columns } from "../../Columns/Columns";
import { Label } from "../Label/Label";

type Option<T> = { id: string; label: string; value: T };

type SelectProps<T> = {
  variant?: "default" | "small" | "grid";
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  valueRenderer?: (value: Option<T>) => ReactNode;
};

function GridRenderer<T>({
  option,
  valueRenderer,
}: {
  option: Option<T>;
  valueRenderer: (value: Option<T>) => ReactNode;
}) {
  return (
    <TooltipTrigger>
      {valueRenderer(option)}
      <Tooltip>{option.label}</Tooltip>
    </TooltipTrigger>
  );
}
function DefaultRenderer<T>({
  option,
  valueRenderer,
}: {
  option: Option<T>;
  valueRenderer?: (value: Option<T>) => ReactNode;
}) {
  return (
    <Columns gap="s" align="center">
      {valueRenderer?.(option)}
      {option.label}
    </Columns>
  );
}

function SmallRenderer<T>({
  option,
  valueRenderer,
}: {
  option: Option<T>;
  valueRenderer?: (value: Option<T>) => ReactNode;
}) {
  return (
    <>
      {valueRenderer?.(option)}
      {option.label}
      <span className={styles.check}>
        <Icon size="s" name="check" />
      </span>
    </>
  );
}

export function Select<T>({
  label,
  variant = "default",
  value,
  onChange,
  options,
  valueRenderer,
}: SelectProps<T>) {
  const id = useId();
  const selectedOption = options.find((option) => option.value === value);
  const onSelectionChange = (key: Key) => {
    const selected = options.find((option) => option.value === key);
    if (selected) {
      onChange(selected.value);
    }
  };

  const OptionRenderer = {
    default: DefaultRenderer,
    small: SmallRenderer,
    grid: GridRenderer,
  }[variant];

  const EmptyRenderer = () => <></>;

  return (
    <RASelect
      id={id}
      className={classNames(styles.select, styles[`isVariant-${variant}`])}
      selectedKey={selectedOption?.label}
      onSelectionChange={onSelectionChange}
    >
      <Label htmlFor={id}>{label}</Label>
      <Button className={styles.button}>
        {selectedOption ? (
          <OptionRenderer
            option={selectedOption}
            valueRenderer={valueRenderer ?? EmptyRenderer}
          />
        ) : (
          "Sélectionner"
        )}
        {variant === "default" && <Icon size="s" name="chevron-down" />}
      </Button>
      <Popover
        className={classNames(styles.popover, styles[`isVariant-${variant}`])}
      >
        <ListBox className={styles.listbox}>
          {options.map((option) => (
            <Item key={option.label} id={option.id} textValue={option.label}>
              <OptionRenderer
                option={option}
                valueRenderer={valueRenderer ?? EmptyRenderer}
              />
            </Item>
          ))}
        </ListBox>
      </Popover>
    </RASelect>
  );
}

function Item(props: ListBoxItemProps & { id: string; children: ReactNode }) {
  return (
    <ListBoxItem {...props} className={styles.option}>
      {({ isSelected }) => (
        <>
          {props.children}
          <span className={styles.check}>
            {isSelected && <Icon size="s" name="check" />}
          </span>
        </>
      )}
    </ListBoxItem>
  );
}
