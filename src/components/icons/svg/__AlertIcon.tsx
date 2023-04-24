import React from "react";

type Props = {
  color: string;
};

export function __AlertIcon({ color }: Props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ verticalAlign: "middle" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.673 2.448c.562-1.068 2.092-1.068 2.654 0l8.344 15.853a1.5 1.5 0 01-1.327 2.199H3.656a1.5 1.5 0 01-1.327-2.199l8.344-15.853zm1.77.466a.5.5 0 00-.886 0L3.214 18.767a.5.5 0 00.442.733h16.688a.5.5 0 00.442-.733L12.442 2.914z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 9.962l.547 3.28.032-.009c.3-.074.65-.108.98-.108.306 0 .622.029.895.094l.545-3.258a1.5 1.5 0 00-2.998 0zM9.5 10a2.5 2.5 0 015 0v.042l-.677 4.04a.5.5 0 01-.926.168.806.806 0 00-.138-.049 2.837 2.837 0 00-.7-.076 3.21 3.21 0 00-.74.08 1.062 1.062 0 00-.25.093.5.5 0 01-.896-.216l-.673-4.04V10zm2.5 6.5a.5.5 0 100 1 .5.5 0 000-1zm-1.5.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
        fill={color}
      />
    </svg>
  );
}
