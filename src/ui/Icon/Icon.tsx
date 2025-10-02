import { type IconName, ICONS } from "./private";

type Size = "s" | "m" | "l";

export type IconProps = {
  name: IconName;
  size?: Size;
};

export function computeSize(value: Size = "m") {
  const factor = {
    l: 6,
    m: 4,
    s: 2,
  } satisfies Record<Size, number>;
  return `calc(0.8rem * ${factor[value]})`;
}

export function Icon({ name, size }: IconProps) {
  const computedSize = computeSize(size);
  const Icon = ICONS[name];

  return (
    <span
      data-component="Icon"
      style={{
        color: "inherit",
        flex: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: computedSize,
        transform: "translateY(var(--icon-margin, 0))",
      }}
      aria-hidden="true"
    >
      <Icon />
    </span>
  );
}
