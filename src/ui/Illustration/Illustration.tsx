import { type IllustrationName, ILLUSTRATIONS } from "./private";
import styles from "./Illustration.module.css";

type Size = "s" | "m" | "l";

export type IconProps = {
  name: IllustrationName;
  size?: Size;
};

function computeSize(value: Size = "m") {
  const factor = {
    l: 24,
    m: 16,
    s: 8,
  } satisfies Record<Size, number>;
  return `calc(0.8rem * ${factor[value]})`;
}

export function Illustration({ name, size }: IconProps) {
  const computedSize = computeSize(size);
  const Illustration = ILLUSTRATIONS[name];

  return (
    <div
      className={styles.illustration}
      style={{
        width: computedSize,
        height: computedSize,
      }}
    >
      <Illustration />
    </div>
  );
}
