import React from "react";
import { Icon, IconName } from "./icons/Icon";
import { css } from "@emotion/css";
import { VAR, colors, radius, shadow } from "../theme/style";

const style = css(`
  position: fixed;
  bottom: ${VAR.SIZE.GAP.M};
  right: ${VAR.SIZE.GAP.M};
  padding: ${VAR.SIZE.PADDING.M.HORIZONTAL};
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  ${radius("ROUNDED")}
  ${shadow("DEFAULT")}
  ${colors("BRAND")}
`);

type Props = {
  onClick: () => void;
  icon: IconName;
};

export function FloatingButton({ icon, onClick }: Props) {
  return (
    <button onClick={onClick} className={style}>
      <Icon name={icon} />
    </button>
  );
}
