import React, { useRef } from "react";
import { Icon, IconName } from "./icons/Icon";
import { css } from "@emotion/css";
import { VAR, radius, shadow } from "../theme/style";
import classNames from "classnames";
import { useActiveEffect } from "../application/useActiveEffect";

const style = css(`
  position: fixed;
  bottom: ${VAR.SIZE.GAP.M};
  right: ${VAR.SIZE.GAP.M};
  padding: ${VAR.SIZE.PADDING.HORIZONTAL.M};
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  ${radius("ROUND")}
  ${shadow(3)}
  z-index: 3;
  background: ${VAR.COLOR.ACCENT.MAIN.BASE};
  color: ${VAR.COLOR.COMMON.SURFACE.BASE};
  font-size: 3rem;
`);

type Props = {
  onClick: () => void;
  icon: IconName;
};

export function FloatingButton({ icon, onClick }: Props) {
  const ref = useRef(null);
  const { beforeStyle } = useActiveEffect(ref, { position: "fixed" });

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={classNames(style, beforeStyle)}
    >
      <span style={{ zIndex: 1, display: "inline-flex" }}>
        <Icon name={icon} />
      </span>
    </button>
  );
}
