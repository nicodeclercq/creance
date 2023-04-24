import { useMemo } from "react";
import { omit } from "../../infrastructure/object";
import { __AlertIcon } from "./svg/__AlertIcon";
import { __LoaderIcon } from "./svg/__LoaderIcon";
import { __CheckIcon } from "./svg/__CheckIcon";
import { __PigIcon } from "./svg/__PigIcon";

export const ICONS = {
  alert: __AlertIcon,
  loader: __LoaderIcon,
  check: __CheckIcon,
  pig: __PigIcon,
} as const;
export type IconName = keyof typeof ICONS;

export const DISPLAY_ICONS = omit(ICONS, ["alert", "check", "loader"] as const);
export type DisplayIconName = keyof typeof DISPLAY_ICONS;

type Props = {
  name: IconName;
  color?: string;
};
export function Icon({ name, color = "currentColor" }: Props) {
  const Component = useMemo(() => ICONS[name], [name]);

  return <Component color={color} />;
}
