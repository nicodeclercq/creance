import { useTranslations } from "../../hooks/useTranslation";
import { Language } from "../../entities/languages";
import { Translation } from "../../@types/translations";

type Props = {
  name: Translation;
  lang?: Language;
  parameters?: { [key: string]: unknown };
};

export function Translate({ lang, name, parameters = {} }: Props) {
  const translations = useTranslations(lang) ?? {};

  const tmp = translations[name] ?? name ?? "";
  const parts = tmp.split(/(%\{[^}]+\})/g);
  const translation = parts
    .map((part: string) => {
      const isParam = part.startsWith("%{") && part.endsWith("}");
      if (isParam) {
        const varName = part.replace(new RegExp(`%{([^}]+)}`, "g"), "$1");
        return varName in parameters ? parameters[varName] : part;
      }
      return part;
    })
    .filter((part) => part !== "")
    .map((part, index) => (
      <span style={index > 0 ? { marginLeft: "0.5ch" } : {}} key={index}>
        {part as string}
      </span>
    ));

  return <>{translation}</>;
}
