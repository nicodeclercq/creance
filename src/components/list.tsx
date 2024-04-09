import React, { useCallback, useMemo } from "react";
import { css } from "@emotion/css";
import { VAR, padding } from "../theme/style";
import { Text } from "./text/text";
import { Card } from "./Card";
import { Title } from "./text/title";

type Props<A> = {
  items: A[] | Record<string, A>;
  itemRenderer?: (a: A) => React.ReactNode;
  isOrdered?: boolean;
  hasSeparators?: boolean;
  noPadding?: boolean;
  negativeMarginSize?: keyof typeof VAR.SIZE.PADDING.HORIZONTAL;
  onEmpty: React.ReactNode;
  header?: React.ReactNode;
};

const defaultRenderer = <A extends unknown>(a: A): React.ReactNode => (
  <Text>
    <>{a}</>
  </Text>
);

export function List<A>({
  isOrdered,
  items,
  itemRenderer = defaultRenderer,
  hasSeparators,
  noPadding,
  negativeMarginSize,
  onEmpty,
  header,
}: Props<A>) {
  const Component = isOrdered ? "ol" : "ul";
  const listItems = useMemo(
    () =>
      items instanceof Array
        ? items.map((i, index) => [`${index}`, i] as const)
        : Object.entries(items),
    [items]
  );
  const listStyle = useMemo(
    () =>
      css(`
        list-style-type: none;
        margin: ${
          negativeMarginSize
            ? `0 calc(${VAR.SIZE.PADDING.HORIZONTAL[negativeMarginSize]} * -1)`
            : 0
        };
        padding: 0;
      `),
    []
  );
  const itemStyle = useCallback(
    (isLast: boolean) =>
      css({
        margin: 0,
        padding: noPadding ? "none" : padding("M"),
        borderBottom: hasSeparators && !isLast ? VAR.SEPARATOR.BASE : "none",
        listStyleType: "none",
      }),
    [hasSeparators, noPadding]
  );

  return (
    <Card>
      <h1>{header}</h1>
      <Component className={listStyle}>
        {listItems.length === 0
          ? onEmpty
          : listItems.map(([key, value], index) => (
              <li
                key={key}
                className={itemStyle(listItems.length - 1 === index)}
              >
                {itemRenderer(value)}
              </li>
            ))}
      </Component>
    </Card>
  );
}
