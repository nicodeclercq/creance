import { FontMetrics, createStyleObject } from "@capsizecss/core";

type Font = {
  NAME: string;
  WEIGHT: string | number;
  SIZE: number;
  LINE_GAP: number;
  METRICS: FontMetrics;
};

export const font = (font: Font) => ({
  fontFamily: font.NAME,
  fontWeight: font.WEIGHT,
  ...createStyleObject({
    fontSize: font.SIZE,
    lineGap: font.LINE_GAP,
    fontMetrics: font.METRICS,
  }),
});
