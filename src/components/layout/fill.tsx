
import React, { useMemo } from 'react';
import { css } from '@emotion/css';
import { DIRECTION, Direction } from '../../styles/direction';
import { ContainerTag, CONTAINER_TAG } from '../../styles/tag';

type Props = {
  children: React.ReactNode;
  as?: ContainerTag;
  background?: string;
  color?: string;
  direction?: Direction;
  shadow?: string;
}

export function Fill({ as = CONTAINER_TAG.DIV, direction = DIRECTION.BOTH, background, color, shadow, children }: Props) {
  const Component = as;

  const style = useMemo(() => css({
      background,
      color,
      boxShadow: shadow,
      width: direction !== DIRECTION.VERTICAL ? '100%' : undefined,
      height: direction !== DIRECTION.HORIZONTAL ? '100%' : undefined,
    }),
    [direction]
  );

  return (
    <Component className={style}>
      {children}
    </Component>
  )
}
