import { createStyleObject } from "@capsizecss/core";
import { Font } from "../theme/theme";

export const font = (font: Font) => ({
  fontFamily: font.NAME,
  fontWeight: font.WEIGHT,
  ...createStyleObject({
    fontSize: font.SIZE,
    lineGap: font.LINE_GAP,
    fontMetrics: font.METRICS
  }),
})