import { Icon } from "../Icon/Icon";
import { IconName } from "../Icon/private";
import styles from "./Avatar.module.css";

type Size = "s" | "m" | "l" | "xl";

export type AvatarProps = {
  label: string;
  image: string;
  size?: Size;
  statusIcon?: IconName;
};

function computeSize(value: Size = "m") {
  const factor = {
    xl: 16,
    l: 8,
    m: 4,
    s: 2,
  } satisfies Record<Size, number>;
  return `calc(0.8rem * ${factor[value]})`;
}

export function computeRandomColor(label: string) {
  const shuffledValues = [
    14, 0, 20, 64, 30, 52, 26, 70, 34, 9, 1, 68, 4, 10, 37, 29, 55, 19, 6, 65,
    32, 43, 36, 62, 46, 71, 12, 49, 45, 66, 56, 3, 42, 38, 24, 47, 39, 50, 13,
    15, 54, 21, 63, 31, 57, 11, 33, 35, 58, 28, 41, 69, 16, 22, 5, 40, 48, 27,
    53, 18, 61, 59, 7, 8, 17, 60, 67, 44, 23, 2, 25, 51,
  ];

  const value = (label ?? "")
    .split("")
    .map((char) => char.codePointAt(0))
    .filter((a) => a != null)
    .reduceRight((acc, cur) => acc + cur || 1, 1);

  const hue =
    shuffledValues[value % shuffledValues.length] *
    (360 / shuffledValues.length);
  const sat = `${50 + 10 * (value % 5)}%`;
  const light = `${30 + 4 * (value % 5)}%`;
  return `hsl(${hue}, ${sat}, ${light})`;
}

function computeFirstLetters(label: string, length: number) {
  return (label ?? "").substring(0, length).toUpperCase();
}

export function Avatar({ label = "", image, size, statusIcon }: AvatarProps) {
  const computedSize = computeSize(size);

  return (
    <div
      data-component="Avatar"
      aria-label={label}
      style={{
        position: "relative",
        aspectRatio: "1/1",
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundColor: computeRandomColor(label),
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        flex: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        width: computedSize,
        height: computedSize,
        fontSize: `calc(${computedSize} / 2)`,
        border: `${
          size === "s" ? "0.1" : "0.2"
        }rem solid var(--ui-background-default)`,
        boxShadow:
          "var(--ui-shadow-inset-subtle), 0 0 0 0.1rem hsl(from var(--ui-primitive-grey-200) h s l / 0.1)",
        borderRadius: "var(--ui-semantic-radius-round)",
      }}
    >
      <span aria-hidden="true">
        {image ? undefined : computeFirstLetters(label, 2)}
      </span>
      {statusIcon && (
        <div className={styles.statusIcon}>
          <Icon name={statusIcon} size="s" />
        </div>
      )}
    </div>
  );
}
