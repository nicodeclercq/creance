import React, { useMemo } from 'react';
import { css } from '@emotion/css';
import { VAR } from '../theme/style';
import { Text } from './text/text';

type Props<A> = {
  items: A[] | Record<string, A>;
  itemRenderer?: (a: A) => React.ReactNode;
  isOrdered?: boolean;
  hasSeparators?: boolean;
  noPadding?: boolean;
  negativeMarginSize?: keyof typeof VAR.SIZE.PADDING;
}

const defaultRenderer = <A extends unknown>(a: A): React.ReactNode => (
  <Text><>{a}</></Text>
)

export function List<A>({ isOrdered, items, itemRenderer = defaultRenderer, hasSeparators, noPadding, negativeMarginSize }: Props<A>) {
  const Component = isOrdered ? 'ol' : 'ul';
  const listItems = useMemo(
    () => items instanceof Array
      ? items.map((i, index) => ([`${index}`, i] as const))
      : Object.entries(items),
    [items]
  );
  const listStyle = useMemo(() => css({
    margin: negativeMarginSize ? `0 calc(${VAR.SIZE.PADDING[negativeMarginSize].HORIZONTAL} * -1)`: 0,
    padding: 0,
  }), []);
  const itemStyle = useMemo(() => css({
    margin: 0,
    padding: noPadding ? 'none' : `${VAR.SIZE.PADDING.M.VERTICAL} ${VAR.SIZE.PADDING.M.HORIZONTAL}`,
    borderBottom: hasSeparators ? VAR.SEPARATOR.DEFAULT : 'none',
    listStyleType: 'none',
  }), []);

  return (
    <Component className={listStyle}>
      {
        listItems.map(([key, value]) => (
          <li key={key} className={itemStyle}>
            {itemRenderer(value)}
          </li>
        ))
      }
    </Component>
  );
}