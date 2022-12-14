import React from 'react';
import { css } from '@emotion/css';

import { FONTS } from '../../theme/theme';
import { font } from '../../infrastructure/style';
import { TextTag } from '../../styles/tag';

const styles = {
  L: css({
    ...font(FONTS.TEXT.L),
    margin: 0,
  }),
  M: css({
    ...font(FONTS.TEXT.M),
    margin: 0,
  }),
  S: css({
    ...font(FONTS.TEXT.S),
    margin: 0,
  }),
} as const;

type Props = {
  as?: TextTag;
  children: React.ReactNode;
  size?: 'L' | 'M' | 'S';
  color?: string;
}

export function Text({as = 'p', children, size = 'M', color}: Props){
  const Component = as;
  return (
    <Component className={styles[size]} style={{color}}>
      {children}
    </Component>
  );
}