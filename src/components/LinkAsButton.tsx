import React, { useMemo, useRef } from "react";
import classnames from "classnames";
import { css } from "@emotion/css";
import { VAR, padding, radius } from "../theme/style";
import { useActiveEffect } from "../application/useActiveEffect";
import { ROUTE, RouteName } from "../router";
import { Link } from "react-router-dom";

const defaultStyles = css(`
  position: relative;
  display: inline-flex;
  ${padding("M")}
  ${radius("INTERACTIVE")}
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
const getLoaderStyle = (isLoading: boolean) =>
  css(`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: ${isLoading ? "visible" : "hidden"};

  & > svg {
    animation: 0.5s linear 0s infinite normal none running rotate;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`);

type Props = {
  type: "primary" | "secondary" | "tertiary";
  to: RouteName;
  children: React.ReactNode;
  title?: string;
};

export function LinkAsButton({ type, to, title, children }: Props) {
  const ref = useRef(null);
  const { beforeStyle } = useActiveEffect(ref, {
    color: type === "secondary" ? VAR.COLOR.ACCENT.SURFACE.WEAKER : undefined,
  });

  return (
    <Link
      ref={ref}
      title={title}
      to={ROUTE[to]}
      className={classnames(defaultStyles, styles[type], beforeStyle)}
    >
      <span
        style={{
          zIndex: 1,
          position: "relative",
        }}
      >
        {children}
      </span>
    </Link>
  );
}
