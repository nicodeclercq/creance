export function UserShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 21a7 7 0 1 0-14 0m7-10a4 4 0 1 1 0-8 4 4 0 0 1 0 8"
      />
      <rect width={2} height={20} x={19} y={2} fill="currentColor" rx={1} />
      <rect
        width={2}
        height={4}
        x={23}
        y={2}
        fill="currentColor"
        rx={1}
        transform="rotate(90 23 2)"
      />
      <rect
        width={2}
        height={7}
        x={23}
        y={11}
        fill="currentColor"
        rx={1}
        transform="rotate(90 23 11)"
      />
      <rect
        width={2}
        height={4}
        x={23}
        y={20}
        fill="currentColor"
        rx={1}
        transform="rotate(90 23 20)"
      />
    </svg>
  );
}
