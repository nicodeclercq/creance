import * as React from "react";
import { VAR } from "../../../theme/style";

type Props = {
  width?: string;
  height?: string;
};

export function __PigIllustration({ width, height }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 26h160l-20 20 20 20H0l20-19.5L0 26z" fill="#FCFCF6" />
      <mask
        id="prefix__a"
        style={{
          maskType: "alpha",
        }}
        maskUnits="userSpaceOnUse"
        x={0}
        y={26}
        width={160}
        height={40}
      >
        <path d="M0 26h160l-20 20 20 20H0l20-19.5L0 26z" fill="#FCFCF6" />
      </mask>
      <g
        mask="url(#prefix__a)"
        stroke={VAR.COLOR.BRAND.BACKGROUND}
        strokeWidth={2}
      >
        <path d="M-15 29h187M-14 63h187M-15 33h187M-14 59h187" />
      </g>
      <circle cx={80} cy={46} r={46} fill="#FCFCF6" />
      <circle
        cx={80}
        cy={46}
        r={43}
        fill="#FCFCF6"
        stroke={VAR.COLOR.BRAND.BACKGROUND}
        strokeWidth={2}
      />
      <circle
        cx={80}
        cy={46}
        r={39}
        fill="#FCFCF6"
        stroke={VAR.COLOR.BRAND.BACKGROUND}
        strokeWidth={2}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M68 37.019l-.572.583a11.96 11.96 0 00-3.306 6.681L63.876 46H62a2 2 0 00-2 2v2a2 2 0 002 2h3.553l.597.856a12.078 12.078 0 002.994 2.994l.856.597V62h4v-4h12v4h4v-5.553l.856-.597a12.027 12.027 0 004.654-6.444l.268-.907.122-.942c.066-.509.1-1.028.1-1.557 0-6.627-5.373-12-12-12h-8c-1.343 0-2.63.22-3.83.624l-1.678.564-.764-1.595A2.807 2.807 0 0068 32.116v4.903zM99.95 47.28l.02-.012a3.813 3.813 0 001.842-3.438 3.818 3.818 0 00-1.241-2.65c-.445-.406-.686-1.05-.422-1.592.264-.543.926-.775 1.411-.417a5.994 5.994 0 011.729 7.663 6.005 6.005 0 01-5.86 3.139A14.026 14.026 0 0192 57.49V62a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2h-8v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4.51A14.077 14.077 0 0164.51 54H62a4 4 0 01-4-4v-2a4 4 0 014-4h.142A13.959 13.959 0 0166 36.202V31.2a1.2 1.2 0 011.2-1.2 4.8 4.8 0 014.331 2.728A13.983 13.983 0 0176 32h8c7.67 0 13.9 6.169 13.999 13.816a14.142 14.142 0 01-.115 1.998 3.811 3.811 0 002.065-.534zM80 30a6 6 0 100-12 6 6 0 000 12zm0-2a4 4 0 100-8 4 4 0 000 8z"
        fill={VAR.COLOR.BRAND.BACKGROUND}
      />
      <path
        d="M70 43a1 1 0 11-2 0 1 1 0 012 0zM76 37a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
        fill={VAR.COLOR.BRAND.BACKGROUND}
      />
    </svg>
  );
}
