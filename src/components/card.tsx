import React, { useMemo } from 'react';
import { css } from '@emotion/css';
import { VAR } from '../theme/style';
import { formatResponsiveSize, getPaddingStyle, Padding, ResponsiveSize } from '../styles/size';
import { ContainerTag } from '../styles/tag';

type Props = {
  as?: ContainerTag;
  children: React.ReactNode;
  width?: ResponsiveSize;
  padding?: Padding;
}

export function Card({as = 'section', width = '100%', padding = 'M', children}: Props) {
  const Component = as;

  const style = useMemo(
    () => css(`
      background: ${VAR.COLOR.DEFAULT.BACKGROUND};
      border-radius: ${VAR.RADIUS.DEFAULT};
      box-shadow: ${VAR.SHADOW.DEFAULT};
      color: ${VAR.COLOR.DEFAULT.COLOR};
      ${getPaddingStyle(padding)}
      ${formatResponsiveSize('width', width)}
    `),
    [width]
  );

  return (
    <Component className={style}>
      {children}
    </Component>
  )
}