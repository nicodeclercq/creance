import React, { useMemo, useRef } from "react";
import classnames from "classnames";
import { css } from "@emotion/css";
import { VAR, padding, radius } from "../theme/style";
import { Icon } from "./icons/Icon";
import { useActiveEffect } from "../application/useActiveEffect";

const defaultStyles = css(`
  position: relative;
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
  onClick: "submit" | (() => void);
  children: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  title?: string;
};

export function Button({
  type,
  onClick,
  title,
  children,
  disabled = false,
  isLoading = false,
}: Props) {
  const ref = useRef(null);
  const { beforeStyle } = useActiveEffect(ref, {
    color: type === "secondary" ? VAR.COLOR.ACCENT.SURFACE.WEAKER : undefined,
  });
  const isSubmit = onClick === "submit";
  const rest = (isSubmit ? {} : { onClick }) as { onClick?: () => void };
  const loaderStyle = useMemo(() => getLoaderStyle(isLoading), [isLoading]);

  return (
    <button
      ref={ref}
      title={title}
      {...rest}
      type={isSubmit ? "submit" : "button"}
      disabled={disabled || isLoading}
      className={classnames(defaultStyles, styles[type], beforeStyle)}
    >
      <span className={loaderStyle}>
        <Icon name="loader" />
      </span>
      <span
        style={{
          zIndex: 1,
          position: "relative",
          visibility: !isLoading ? "visible" : "hidden",
        }}
      >
        {children}
      </span>
    </button>
  );
}
