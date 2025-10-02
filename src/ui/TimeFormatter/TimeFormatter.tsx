import { Paragraph, ParagraphProps } from "../Paragraph/Paragraph";

import { useTranslation } from "react-i18next";

export type TimeFormatterProps = {
  children: Date;
  withTime?: boolean;
  styles?: ParagraphProps["styles"];
};

export function TimeFormatter({ children, styles }: TimeFormatterProps) {
  const { t } = useTranslation();

  const str = t("component.formatter.time", { date: children });

  return <Paragraph data-component="TimeFormatter" styles={styles}>{str}</Paragraph>;
}
