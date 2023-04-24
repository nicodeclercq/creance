import React from "react";

type Props = {
  color: string;
};

export function __LoaderIcon({ color }: Props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ verticalAlign: "middle" }}
    >
      <path
        d="M22 12A10 10 0 1112 2v.937A9.063 9.063 0 1021.063 12H22z"
        fill={color}
      />
    </svg>
  );
}
