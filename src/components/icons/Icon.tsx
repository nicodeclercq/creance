import { useMemo } from "react";
import { __AlertIcon } from "./svg/__AlertIcon";
import { __LoaderIcon } from "./svg/__LoaderIcon";
import { __CheckIcon } from "./svg/__CheckIcon";
import { __PigIcon } from "./svg/__PigIcon";
import { __AddIcon } from "./svg/__AddIcon";

export const DISPLAY_ICONS = {
  pig: __PigIcon,
} as const;

export const FUNCTIONAL_ICONS = {
  add: __AddIcon,
  alert: __AlertIcon,
  loader: __LoaderIcon,
  check: __CheckIcon,
};

export const ICONS = {
  ...FUNCTIONAL_ICONS,
  ...DISPLAY_ICONS,
} as const;

export type IconName = keyof typeof ICONS;

export type FunctionalIconName = keyof typeof FUNCTIONAL_ICONS;
export type DisplayIconName = keyof typeof DISPLAY_ICONS;

type Props = {
  name: IconName;
  color?: string;
};
export function Icon({ name, color = "currentColor" }: Props) {
  const Component = useMemo(() => ICONS[name], [name]);

  return <Component color={color} />;
}
