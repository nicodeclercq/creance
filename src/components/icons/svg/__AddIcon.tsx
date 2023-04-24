import React from "react";

type Props = {
  color: string;
};

export function __AddIcon({ color }: Props) {
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
        d="M12.5 4.254c0-.14-.224-.254-.5-.254s-.5.114-.5.254V11.5H4.254c-.14 0-.254.224-.254.5s.114.5.254.5H11.5v7.246c0 .14.224.254.5.254s.5-.114.5-.254V12.5h7.246c.14 0 .254-.224.254-.5s-.114-.5-.254-.5H12.5V4.254z"
        fill={color}
      />
    </svg>
  );
}
