import React from 'react';
import { css } from '@emotion/css';

import { FONTS } from '../../theme/theme';
import { font } from '../../infrastructure/style';

const styles = css({
  ...font(FONTS.HEADING),
  margin: 0,
});

type Props = {
  children: string;
  color?: string;
}

export function Title({children, color}: Props){
  return <h1 className={styles} style={{color}}>{children}</h1>
}