import { Paragraph, ParagraphProps } from "../Paragraph/Paragraph";

import { useTranslation } from "react-i18next";

type CalendarDateProps = {
  date: Date;
  styles?: ParagraphProps["styles"];
};

export function CalendarDate({ date, styles }: CalendarDateProps) {
  const { t } = useTranslation();

  return (
    <Paragraph styles={styles}>
      {t("component.calendarDate.date", { date })}
    </Paragraph>
  );
}
