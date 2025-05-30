import { GridList, GridListItem } from "react-aria-components";
import styles from "./CheckboxList.module.css";

import { Checkbox } from "../Checkbox/Checkbox";
import { type ReactNode } from "react";

type Item = {
  label: string;
  value: string;
};

type CheckboxListProps<T extends Item> = {
  items: T[];
  renderer: (value: T) => ReactNode;
};

export function CheckboxList<T extends Item>({
  items,
  renderer,
}: CheckboxListProps<T>) {
  return (
    <GridList
      aria-label="Favorite pokemon"
      selectionMode="multiple"
      className={styles.CheckboxList}
    >
      {items.map((item) => (
        <GridListItem
          key={item.value}
          textValue={item.label}
          className={styles.CheckboxListItem}
        >
          <Checkbox slot="selection" />
          {renderer(item)}
        </GridListItem>
      ))}
    </GridList>
  );
}
