import { ICONS } from "../ui/Icon/private";
import { Icon } from "../ui/Icon/Icon";
import type { IconName } from "../ui/Icon/private";
import { PageTemplate } from "../shared/PageTemplate/PageTemplate";
import { useTranslation } from "react-i18next";

export function IconsPage() {
  const { t } = useTranslation();
  return (
    <PageTemplate title={t("page.help.iconsList.title")}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {Object.keys(ICONS).map((name) => (
          <div key={name} style={{ border: "1px solid red" }}>
            <Icon name={name as IconName} />
          </div>
        ))}
      </div>
    </PageTemplate>
  );
}
