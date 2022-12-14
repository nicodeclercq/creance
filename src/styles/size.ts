import { isObject, getOptional } from './../infrastructure/object';
import * as Record from 'fp-ts/Record';
import { AtLeastOne } from "../../@types/atLeastOne";
import { VAR } from "../theme/style";
import { getStyle, Responsive } from "./responsive";

type Unit = '%' | 'rem' | 'vw' | 'vh';

export type ResponsiveSize = Responsive<`${number}${Unit}`> | 'auto';

type Property = 'width' | 'min-width' | 'max-width' | 'height' | 'min-height' | 'max-height';
export const formatResponsiveSize = (property: Property, responsize: ResponsiveSize) => getStyle(responsize, (v: ResponsiveSize) => `${property}: ${v};`);

type _Padding = keyof typeof VAR.SIZE.PADDING;
export type Padding = _Padding | AtLeastOne<{x: _Padding, y: _Padding}>;
export const getPaddingStyle = (padding: Padding | undefined) => {
  if(padding == null){
    return '';
  }
  if(typeof padding === 'string'){
    return `padding: ${VAR.SIZE.PADDING[padding].VERTICAL}  ${VAR.SIZE.PADDING[padding].HORIZONTAL};`;
  } else if(isObject(padding)) {
    const x = getOptional('x')(padding) as _Padding | undefined;
    const y = getOptional('y')(padding) as _Padding | undefined;

    return `padding: ${y != null ? VAR.SIZE.PADDING[y].VERTICAL : '0'} ${x != null ? VAR.SIZE.PADDING[x].HORIZONTAL : '0'}`;
  }
}