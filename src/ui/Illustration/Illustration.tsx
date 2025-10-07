import { type IllustrationName, ILLUSTRATIONS } from "./private";
import styles from "./Illustration.module.css";

type Size = "s" | "m" | "l";

export type IconProps = {
  name: IllustrationName;
  label?: string;
  size?: Size;
  ratio?: "4:3" | "16:9" | "1:1";
};

const ASPECT_RATIO = {
  "4:3": "4/3",
  "16:9": "16/9",
  "1:1": "1/1",
} as const;

function computeSize(value: Size = "m") {
  const factor = {
    l: 24,
    m: 16,
    s: 8,
  } satisfies Record<Size, number>;
  return `calc(0.8rem * ${factor[value]})`;
}

export function isIllustration(image: string): image is IllustrationName {
  return image in ILLUSTRATIONS;
}

export function Illustration({ name, size, ratio, label }: IconProps) {
  const computedSize = computeSize(size);
  const Illustration = ILLUSTRATIONS[name];

  const aspectRatio = ratio ? ASPECT_RATIO[ratio] : undefined;

  return (
    <div
      data-component="Illustration"
      aria-label={label}
      aria-hidden={!label ? undefined : true}
      className={styles.illustration}
      style={{
        width: aspectRatio == null ? computedSize : undefined,
        height: computedSize,
        aspectRatio,
      }}
    >
      <Illustration />
    </div>
  );
}
