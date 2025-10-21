import type { HTMLElementType, ReactNode } from "react";

import type { Styles } from "./styles";
import classNames from "classnames";
import { computeStyles } from "./styles";
import { css } from "@emotion/css";

export type ContainerStyles<K extends keyof Styles = keyof Styles> = Pick<
  Styles,
  K
>;

type ContainerProps = {
  id?: string;
  children?: ReactNode;
  styles?: Styles;
  as?: HTMLElementType;
  "data-component"?: string;
};

export function Container({
  id,
  children,
  as: Component = "div",
  styles = {},
  "data-component": dataComponent,
}: ContainerProps) {
  const computedStyles = computeStyles(styles);

  return (
    <Component
      id={id}
      data-component={dataComponent || "Container"}
      className={classNames(
        css(computedStyles),
        css({
          margin: 0,
        })
      )}
    >
      {children}
    </Component>
  );
}
