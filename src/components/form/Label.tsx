import React from 'react';
import { css } from '@emotion/css';
import { font } from '../../infrastructure/style';
import { FONTS } from '../../theme/theme';
import { VAR } from '../../theme/style';

const styles = css({
  ...font(FONTS.TEXT.S),
    flexGrow: '1',
    textTransform: 'capitalize',
});

type Props = {
  htmlFor: string;
  children: React.ReactNode;
  gridArea?: string;
  asErrors: boolean;
};

export function Label({htmlFor, children, asErrors, gridArea}: Props) {
  return (
    <label htmlFor={htmlFor} className={styles} style={{gridArea, color: asErrors ? VAR.COLOR.NEGATIVE.DEFAULT : 'inherit'}}>
      {children}
    </label>
  )
}