import React from "react";

type Props = {
  color: string;
};

export function __CheckIcon({ color }: Props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ verticalAlign: "middle" }}
    >
      <path
        d="M9.6 18.6a.597.597 0 01-.424-.176l-6-6a.6.6 0 11.848-.848L9.6 17.152 21.176 5.576a.6.6 0 11.848.848l-12 12a.598.598 0 01-.424.176z"
        fill={color}
      />
    </svg>
  );
}
