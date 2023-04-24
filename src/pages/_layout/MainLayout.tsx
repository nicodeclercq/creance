import React from "react";
import { css } from "@emotion/css";
import { VAR } from "../../theme/style";
import { Header } from "./Header";
import { User } from "../../domain/auth/User";

type Props = {
  user: User;
  children: React.ReactNode;
};

const styles = css(`
  display: grid;
  grid-gap: ${VAR.SIZE.GAP.DEFAULT};
  grid-template-columns: 1fr  2fr;
  grid-template-areas: "header header" "sidebar content";
`);

export function MainLayout({ user, children }: Props) {
  return (
    <div className={styles}>
      <Header user={user} />
      {children}
    </div>
  );
}
