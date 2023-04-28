import React from "react";
import { css } from "@emotion/css";
import { Card, Props as CardProps } from "./Card";
import { Illustration } from "./Illustration/Illustration";
import { VAR } from "../theme/style";

type Props = {
  children: React.ReactNode;
} & CardProps;

const style = {
  wrapper: css(`
    position: relative;
    margin-top: 4rem;
  `),
  illustrationWrapper: css(`
    position: absolute;
    top: -4rem;
    left: 50%;
    transform: translateX(-50%);
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.05)) drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.25));
    color: ${VAR.COLOR.BRAND.MAIN.STRONG};
  `),
  contentWrapper: css(`
    margin-top: 4rem;
  `),
} as const;

export function PigCard({ children, elevation = 5, ...cardProps }: Props) {
  return (
    <div className={style.wrapper}>
      <div className={style.illustrationWrapper}>
        <Illustration name="pig" height="8rem" width="100%" />
      </div>
      <Card elevation={elevation} {...cardProps}>
        <div className={style.contentWrapper}>{children}</div>
      </Card>
    </div>
  );
}
