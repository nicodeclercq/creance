import { computeRandomColor } from "../Avatar/Avatar";
import { computeSize } from "../Icon/Icon";
import { type CategoryIconName, CATEGORY_ICONS } from "./private";
import styles from "./CategoryIcon.module.css";

type Size = "s" | "m" | "l";

export type IconProps = {
  name: CategoryIconName;
  size?: Size;
  label: string;
};

export function CategoryIcon({ name, size, label }: IconProps) {
  const computedSize = computeSize(size);
  const Icon = CATEGORY_ICONS[name].component;
  const color = computeRandomColor(name);

  return (
    <div
      data-component="CategoryIcon"
      className={styles.icon}
      style={{
        color: "white",
        background: color,
        borderRadius: "var(--ui-semantic-radius-m)",
        flex: "none",
        display: "flex",
        strokeWidth: "0.2rem",
        alignItems: "center",
        justifyContent: "center",
        width: computedSize,
        height: computedSize,
        fontSize: "1.5em",
        boxShadow: "var(--ui-shadow-inset-subtle)",
      }}
      aria-hidden={!label ? undefined : true}
      aria-label={label}
    >
      <Icon />
    </div>
  );
}
