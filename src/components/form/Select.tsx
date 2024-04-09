import React from "react";

type MultiOnchange = <T>(value: T[]) => void;
type SingleOnchange = <T>(value: T) => void;

type BaseProps<T extends string | number | boolean> = {
  id?: string;
  options: { label: string; value: T }[];
  value?: T;
  width?: string;
};
type MultipleValuesProps = {
  multiple: true;
  onChange: MultiOnchange;
};
type SingleValueProps = {
  multiple?: false;
  onChange: SingleOnchange;
};
type Props<T extends string | number | boolean> = BaseProps<T> &
  (MultipleValuesProps | SingleValueProps);

const isMulti = <T extends string | number | boolean>(
  props: Props<T>
): props is BaseProps<T> & MultipleValuesProps => props.multiple === true;

export function Select<T extends string | number | boolean>(props: Props<T>) {
  const { id, onChange, options, value, width, multiple = false } = props;

  return (
    <select
      id={id}
      className={`focus:ring-4 ${multiple ? "" : "h-7"}`}
      onChange={(e) => {
        if (!isMulti(props)) {
          return (onChange as SingleOnchange)(e.target.value as T);
        }

        const values = Array.from(
          e.target.querySelectorAll("option:checked")
        ).map((option) => (option as HTMLOptionElement).value as T);
        (onChange as MultiOnchange)(values);
      }}
      value={`${value}`}
      multiple={multiple}
      style={width ? { width } : {}}
    >
      {options.map(({ value, label }) => (
        <option key={`${label}_${value}`} value={`${value}`}>
          {label}
        </option>
      ))}
    </select>
  );
}
