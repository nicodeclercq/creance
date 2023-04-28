import React from "react";
import { User, isCompleteUser } from "../../domain/auth/User";
import { Icon } from "../../components/icons/Icon";
import { css } from "@emotion/css";
import { VAR, padding, shadow } from "../../theme/style";

const style = css(`
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 3rem;
  background: ${VAR.COLOR.BRAND.MAIN.BASE};
  color: ${VAR.COLOR.COMMON.SURFACE.BASE};
  ${padding("L")}
  ${shadow(1)}
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
