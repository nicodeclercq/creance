import { LogoBoth } from "./private/LogoBoth";
import { LogoPig } from "./private/LogoPig";
import { LogoText } from "./private/LogoText";

type Size = "s" | "m" | "l";
export function computeSize(value: Size = "m") {
  const factor = {
    l: 6,
    m: 4,
    s: 2,
  } satisfies Record<Size, number>;
  return `calc(0.8rem * ${factor[value]})`;
}

const SHOW = {
  both: LogoBoth,
  pig: LogoPig,
  text: LogoText,
};

type LogoProps = {
  size?: Size;
  hasBackground?: boolean;
  show?: keyof typeof SHOW;
};

export function Logo({
  size = "m",
  show = "both",
  hasBackground = false,
}: LogoProps) {
  const computedSize = computeSize(size);
  const Component = SHOW[show];

  return <Component height={computedSize} hasBackground={hasBackground} />;
}
