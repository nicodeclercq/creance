import styles from "./LoadingIcon.module.css";

export function LoadingIcon() {
  return (
    <svg
      className={styles.loader}
      width="1em"
      height="1em"
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
