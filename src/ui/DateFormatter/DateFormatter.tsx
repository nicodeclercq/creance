import { Paragraph } from "../Paragraph/Paragraph";
import { useTranslation } from "react-i18next";

export type DateProps = {
  children: Date;
};

export function DateFormatter({ children }: DateProps) {
  const { t } = useTranslation();

  return (
    <Paragraph>
      {t("component.calendarDate.date", { date: children })}
    </Paragraph>
  );
}
