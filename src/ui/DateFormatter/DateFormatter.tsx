import { Paragraph, ParagraphProps } from "../Paragraph/Paragraph";

import { useTranslation } from "react-i18next";

export type DateProps = {
  children: Date;
  format?: "short" | "medium" | "long";
  withTime?: boolean;
  styles?: ParagraphProps["styles"];
};

export function DateFormatter({
  children,
  format = "short",
  withTime = false,
  styles,
}: DateProps) {
  const { t } = useTranslation();

  return (
    <Paragraph styles={styles}>
      {t(`component.formatter.date.${format}.${withTime ? "time" : "noTime"}`, {
        date: children,
      })}
    </Paragraph>
  );
}
