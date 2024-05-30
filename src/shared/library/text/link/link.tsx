import { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useCss } from "react-use";

import { RouteName, getPath } from "../../../../routes";
import { Text } from "../text/text";

type Props = {
  children: ReactNode;
  to: RouteName;
  download?: boolean;
  parameters?: { [key: string]: string };
  display?: "inline" | "block";
};

export function Link({
  display = "inline",
  children,
  to,
  download = false,
  parameters = {},
}: Props) {
  const style = useCss({
    display: "block",
    textDecoration: "none",
    "&, &:visited, &:active": {
      color: "inherit",
    },
  });

  return download ? (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={getPath(to)}
      className={style}
      style={{ display, width: display === "block" ? "100%" : undefined }}
    >
      {children}
    </a>
  ) : (
    <RouterLink
      to={getPath(to, parameters)}
      className={style}
      style={{ display, width: display === "block" ? "100%" : undefined }}
    >
      <Text>{children}</Text>
    </RouterLink>
  );
}
