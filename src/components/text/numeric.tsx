import React from 'react';
import { css } from '@emotion/css';

import { FONTS } from '../../theme/theme';
import { font } from '../../infrastructure/style';
import { TextTag } from '../../styles/tag';

const styles = {
  L: css({
    ...font(FONTS.NUMERIC.L),
    margin: 0,
    whiteSpace: 'nowrap',
  }),
  M: css({
    ...font(FONTS.NUMERIC.M),
    margin: 0,
    whiteSpace: 'nowrap',
  }),
  S: css({
    ...font(FONTS.NUMERIC.S),
    margin: 0,
    whiteSpace: 'nowrap',
  }),
} as const;

export type Props = {
  as?: TextTag;
  children: number | string;
  size?: 'L' | 'M' | 'S';
  color?: string;
}

export function Numeric({as = 'span', children, size = 'M', color}: Props){
  const Component = as;
  return (
    <Component className={styles[size]} style={{color}}>
      {children}
    </Component>
  );
}