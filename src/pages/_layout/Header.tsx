import React from "react";
import { User, isCompleteUser } from "../../domain/auth/User";
import { Icon } from "../../components/icons/Icon";
import { css } from "@emotion/css";
import { VAR, colors, padding, shadow } from "../../theme/style";

const style = css(`
  width: 100%;
  display: flex;
  align-items: center;
  grid-column: span 2;
  font-size: ${VAR.SIZE.BASE.L};
  ${colors("BRAND")}
  ${padding("L")}
  ${shadow("DEFAULT")}
`);

type Props = {
  user: User;
};

export function Header({ user }: Props) {
  const isComplete = isCompleteUser(user);
  return (
    <div className={style}>
      {isComplete ? user.displayName : <Icon name="pig" />}
    </div>
  );
}
