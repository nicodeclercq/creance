import React from 'react';

import { Props as NumericProps, Numeric } from './numeric';

type Props = NumericProps & {
  currency?: '€';
}

export function Currency({children, currency = '€', ...props}: Props){
  return (
    <Numeric {...props}>
      {`${children} ${currency}`}
    </Numeric>
  );
}