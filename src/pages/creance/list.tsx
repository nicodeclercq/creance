import React from "react";
import { MainLayout } from "../_layout/MainLayout";
import { User } from "../../domain/auth/User";
import { Card } from "../../components/Card";
import { List } from "../../components/List";
import { useCreance } from "../../domain/useCreance";
import { FloatingButton } from "../../components/FloatingButton";

type Props = {
  user: User;
};

export function CreanceList({ user }: Props) {
  const { list } = useCreance();

  return (
    <MainLayout user={user}>
      <div></div>
      <Card>
        <List
          items={list}
          hasSeparators
          itemRenderer={(creance) => <span>{creance.name}</span>}
        />
        <FloatingButton icon="check" onClick={() => console.log("[YOUPI]")} />
      </Card>
    </MainLayout>
  );
}
