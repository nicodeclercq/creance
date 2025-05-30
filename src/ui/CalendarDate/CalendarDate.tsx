import { Paragraph } from "../Paragraph/Paragraph";
import { useTranslation } from "react-i18next";

type CalendarDateProps = {
  date: Date;
};

export function CalendarDate({ date }: CalendarDateProps) {
  const { t } = useTranslation();

  return <Paragraph>{t("component.calendarDate.date", { date })}</Paragraph>;
}
