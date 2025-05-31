import styles from "./LoadingIcon.module.css";

type Size = "s" | "m" | "l";
type LoadingIconProps = {
  size?: Size;
};

export function LoadingIcon({ size }: LoadingIconProps) {
  const factor = {
    l: 6,
    m: 4,
    s: 2,
  } satisfies Record<Size, number>;

  return (
    <svg
      className={styles.loader}
      width={size ? `calc(0.8rem * ${factor[size]})` : "1em"}
      height={size ? `calc(0.8rem * ${factor[size]})` : "1em"}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
    </svg>
  );
}
