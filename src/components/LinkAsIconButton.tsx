import React, { useMemo, useRef } from "react";
import classnames from "classnames";
import { css } from "@emotion/css";
import { VAR, padding, radius } from "../theme/style";
import { useActiveEffect } from "../application/useActiveEffect";
import { ROUTE, RouteName } from "../router";
import { Link } from "react-router-dom";
import { Icon, IconName } from "./icons/Icon";

const SIZE = {
  M: css`
    width: 3em;
    height: 3em;
  `,
  L: css`
    width: 4rem;
    height: 4rem;
    font-size: 2rem;
  `,
};

const defaultStyles = css(`
  position: relative;
  line-height: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${radius("ROUND")}
  transition: background 0.1s ease-in;

  &:focus {
    outline: 2px solid ${VAR.COLOR.ACCENT.SURFACE.STRONG};
    outline-offset: 2px;
  }
  &:not(:disabled){
    cursor: pointer;
  }
`);
const styles = {
  primary: css(`
    border: 1px solid ${VAR.COLOR.BRAND.MAIN.STRONGER};
    color: ${VAR.COLOR.COMMON.SURFACE.BASE};
    background: ${VAR.COLOR.BRAND.MAIN.BASE};

    :hover{
      background: ${VAR.COLOR.BRAND.MAIN.STRONG};
    }
  `),
  secondary: css(`
    color: ${VAR.COLOR.BRAND.MAIN.STRONG};
    border: 1px solid currentColor;
    background: ${VAR.COLOR.COMMON.SURFACE.BASE};

    :hover{
      background: ${VAR.COLOR.BRAND.SURFACE.WEAKER};
    }
  `),
  tertiary: css(`
    border: none;
    background: ${VAR.COLOR.COMMON.SURFACE.BASE};

    :hover{
      background: ${VAR.COLOR.NEUTRAL.SURFACE.WEAKER};
    }
  `),
};

type Props = {
  type: "primary" | "secondary" | "tertiary";
  to: RouteName;
  icon: IconName;
  title?: string;
  size?: keyof typeof SIZE;
};

export function LinkAsIconButton({ type, to, title, icon, size = "M" }: Props) {
  const ref = useRef(null);
  const { beforeStyle } = useActiveEffect(ref, {
    color: type === "secondary" ? VAR.COLOR.ACCENT.SURFACE.WEAKER : undefined,
  });

  return (
    <Link
      ref={ref}
      title={title}
      to={ROUTE[to]}
      className={classnames(
        defaultStyles,
        styles[type],
        SIZE[size],
        beforeStyle
      )}
    >
      <span
        style={{
          zIndex: 1,
          position: "relative",
        }}
      >
        <Icon name={icon} />
      </span>
    </Link>
  );
}
