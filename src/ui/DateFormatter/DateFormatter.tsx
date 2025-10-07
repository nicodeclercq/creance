import { useTranslation } from "react-i18next";

export type DateProps = {
  children: Date;
  format?:
    | "short"
    | "medium"
    | "long"
    | "FullDate"
    | "FullDateAbbr"
    | "NoDayOfWeek"
    | "NoDayOfWeekAbbr"
    | "NoYear"
    | "AbbrNoYear";
  isCapitalized?: boolean;
  withTime?: boolean;
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function DateFormatter({
  children,
  format = "medium",
  isCapitalized = true,
}: DateProps) {
  const { t } = useTranslation();

  const formats = {
    short: "component.formatter.date.short", // L 02
    medium: "component.formatter.date.medium", // Lun. 02
    long: "component.formatter.date.long", // Lundi 02
    FullDate: "component.formatter.date.fullDate", // Lundi 02 septembre 2025
    FullDateAbbr: "component.formatter.date.fullDateAbbr", // Lundi 2 sept. 2025
    NoDayOfWeek: "component.formatter.date.noDayOfWeek", // 02 septembre 2025
    NoDayOfWeekAbbr: "component.formatter.date.noDayOfWeekAbbr", // 02 sept. 2025
    NoYear: "component.formatter.date.noYear", // Lundi 02 septembre
    AbbrNoYear: "component.formatter.date.abbrNoYear", // Lundi 02 sept.
  } as const;

  const str = t(formats[format], { date: children });

  return isCapitalized ? capitalize(str) : str;
}
