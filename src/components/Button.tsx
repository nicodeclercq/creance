import React, { useMemo } from "react";
import classnames from "classnames";
import { css } from "@emotion/css";
import { VAR } from "../theme/style";
import { Icon } from "./icons/Icon";

const defaultStyles = css(`
  position: relative;
  padding: ${VAR.SIZE.PADDING.S.VERTICAL} ${VAR.SIZE.PADDING.S.HORIZONTAL};
  border-radius: ${VAR.RADIUS.DEFAULT};

  &:focus {
    outline: 2px solid ${VAR.COLOR.BRAND.BACKGROUND};
    outline-offset: 2px;
  }
  &:not(:disabled){
    cursor: pointer;
  }
`);
const styles = {
  primary: css(`
    border: 1px solid ${VAR.COLOR.BRAND.BACKGROUND};
    background: ${VAR.COLOR.BRAND.BACKGROUND};
    color: ${VAR.COLOR.BRAND.COLOR}
  `),
  secondary: css(`
    background: none;
    border: 1px solid currentColor
  `),
  tertiary: css(`
    background: none;
    border: none;
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
  const isSubmit = onClick === "submit";
  const rest = (isSubmit ? {} : { onClick }) as { onClick?: () => void };
  const loaderStyle = useMemo(() => getLoaderStyle(isLoading), [isLoading]);

  return (
    <button
      title={title}
      {...rest}
      type={isSubmit ? "submit" : "button"}
      disabled={disabled || isLoading}
      className={classnames(defaultStyles, styles[type])}
    >
      <span className={loaderStyle}>
        <Icon name="loader" />
      </span>
      <span style={{ visibility: !isLoading ? "visible" : "hidden" }}>
        {children}
      </span>
    </button>
  );
}
