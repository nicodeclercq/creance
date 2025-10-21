import { GridList, GridListItem } from "react-aria-components";
import styles from "./CheckboxList.module.css";
import * as ArrayFP from "fp-ts/Array";
import * as Option from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { Checkbox } from "../Checkbox/Checkbox";
import { type ReactNode } from "react";
type Item<T> = {
  label: string;
  id: string;
  value: T;
};

type CheckboxListProps<T> = {
  items: Item<T>[];
  valueRenderer?: (value: T) => ReactNode;
  onChange: (value: T[]) => void;
  values: Item<T>[];
};

export function CheckboxList<T>({
  items,
  valueRenderer,
  onChange,
  values,
}: CheckboxListProps<T>) {
  return (
    <GridList
      data-component="CheckboxList"
      aria-label="Favorite pokemon"
      selectionMode="multiple"
      className={styles.CheckboxList}
      selectedKeys={values.map((value) => value.id)}
      onSelectionChange={(selection) =>
        pipe(
          selection,
          Array.from,
          ArrayFP.map((value) => items.find((i) => i.id === value)),
          ArrayFP.filterMap((item) =>
            Option.fromNullable(item ? item.value : undefined),
          ),
          onChange,
        )
      }
    >
      {items.map((item) => (
        <GridListItem
          id={item.id}
          value={item}
          key={item.id}
          textValue={item.label}
          className={styles.CheckboxListItem}
        >
          <Checkbox slot="selection" />
          {valueRenderer ? (
            valueRenderer(item.value)
          ) : (
            <span>{item.label}</span>
          )}
        </GridListItem>
      ))}
    </GridList>
  );
}
