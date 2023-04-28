import React, { useState } from "react";
import { MainLayout } from "../_layout/MainLayout";
import { User } from "../../domain/auth/User";
import { Card } from "../../components/Card";
import { List } from "../../components/List";
import { useCreance } from "../../domain/useCreance";
import { FloatingButton } from "../../components/FloatingButton";
import { StepCard } from "../../components/StepCard";
import { NameForm } from "./form/NameForm";

type Props = {
  user: User;
};

export function CreanceList({ user }: Props) {
  const { list } = useCreance();
  const [name, setName] = useState("");

  return (
    <MainLayout user={user}>
      <StepCard
        lastStepButton={{
          text: "Valider",
          onClick: () => console.log("[YOUPI]"),
        }}
        onChange={console.log}
        steps={[
          () => (
            <NameForm
              defaultValue={name}
              onSubmit={({ name }) => setName(name)}
            />
          ),
          () => <div>2</div>,
          () => <div>3</div>,
          () => <div>4</div>,
          () => <div>5</div>,
        ]}
      />
      <Card>
        <List
          items={list}
          hasSeparators
          itemRenderer={(creance) => <span>{creance.name}</span>}
        />
        <FloatingButton icon="add" onClick={() => console.log("[YOUPI]")} />
      </Card>
    </MainLayout>
  );
}
