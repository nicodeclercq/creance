import React from "react";
import { VAR } from "../../theme/style";
import { Header } from "./Header";
import { User } from "../../domain/auth/User";
import { Grid } from "../../components/layout/grid";
import { Flex } from "../../components/layout/flex";

type Props = {
  user: User;
  children: React.ReactNode;
};

export function MainLayout({ user, children }: Props) {
  return (
    <Grid columns={1} gap={VAR.SIZE.GAP.M}>
      <Header user={user} />
      <Flex padding="M">{children}</Flex>
    </Grid>
  );
}
