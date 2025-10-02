import { Tooltip, TooltipTrigger } from "react-aria-components";

import { Icon } from "../Icon/Icon";
import styles from "./ExternalLink.module.css";
import { useTranslation } from "react-i18next";

type ExternalLinkProps = {
  url: string;
  children: string;
};

export function ExternalLink({ url, children }: ExternalLinkProps) {
  const { t } = useTranslation();

  return (
    <TooltipTrigger data-component="ExternalLink" delay={0}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        <Icon name="link" size="s" />
        <span className={styles.linkText}>{children}</span>
      </a>
      <Tooltip className={styles.tooltip}>
        {t("ExternalLink.actions.click")}
      </Tooltip>
    </TooltipTrigger>
  );
}
