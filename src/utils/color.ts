import { SHADE_COLORS } from './../entities/color';
import { moduloRange } from './number';
import * as Sum from './../models/Sum';

const getCodeNbFromStr = (str: string) => {
  const codes = str
      .split('')
      .map(c => c.charCodeAt(0))
      .reduce((acc, cur) => acc + (cur - 48), '1')
      .padStart(6, '0')
      .match(/.{1,5}/g)
      .map(c => parseInt(c, 10));

  const sum = codes
    .map(Sum.of)
    .reduce(Sum.concat,Sum.empty());

  return sum.value && codes.length
    ? Math.round(sum.value  / codes.length)
    : 255;
}

export const generateColor = (str: string) => {
  const code = getCodeNbFromStr(str);
  const color = moduloRange({min: 0, max: SHADE_COLORS.length - 1})(code);
  return SHADE_COLORS[color];
}

export const getColor = (index: number) => {
  return SHADE_COLORS[moduloRange({max: SHADE_COLORS.length - 1})(index)];
}