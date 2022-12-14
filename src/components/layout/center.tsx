import React, { useMemo } from 'react';
import { css } from '@emotion/css';
import { DIRECTION, Direction } from '../../styles/direction';
import { ContainerTag, CONTAINER_TAG } from '../../styles/tag';

type Props = {
  as?: ContainerTag;
  isInline?: boolean;
  direction?: Direction;
  children: React.ReactNode;
}

export function Center({ as = CONTAINER_TAG.DIV, isInline, direction = DIRECTION.BOTH, children }: Props) {
  const Component = as;

  const style = useMemo(() => css({
      display: isInline ? 'inline-flex' : 'flex',
      justifyContent: direction !== DIRECTION.VERTICAL ? 'center' : 'flex-start',
      alignItems: direction !== DIRECTION.HORIZONTAL ? 'center' : 'flex-start',
      width: direction !== DIRECTION.VERTICAL ? '100%' : undefined,
      height: direction !== DIRECTION.HORIZONTAL ? '100%' : undefined,
    }),
    [direction, isInline]
  );

  return (
    <Component className={style}>
      {children}
    </Component>
  )
}
