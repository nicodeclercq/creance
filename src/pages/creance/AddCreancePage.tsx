import { useState } from "react";
import { useCurrentUser } from "../../application/useCurrentUser";
import { StepCard } from "../../components/StepCard";
import { MainLayout } from "../_layout/MainLayout";
import { NameForm } from "./form/NameForm";
import { Panel } from "../../components/Panel";
import { User } from "../../domain/auth/User";
import { UsersForm } from "./form/UsersForm";

export function AddCreancePage() {
  const [user] = useCurrentUser();
  const [name, setName] = useState("");
  const [users, setUsers] = useState<User["uid"][]>([]);

  const nameFormChange = ({ name }: { name: string }) => {
    setName(name);
  };

  const usersFormChange = ({ users }: { users: User["uid"][] }) => {
    setUsers(users);
  };

  return (
    <MainLayout user={user}>
      <Panel title="Ajouter une créance">
        <StepCard
          lastStepButton={{
            text: "Valider",
            onClick: () => console.log("[YOUPI]"),
          }}
          onChange={console.log}
          steps={[
            () => <NameForm defaultValue={name} onSubmit={nameFormChange} />,
            () => <UsersForm defaultValue={users} onSubmit={usersFormChange} />,
            () => <div>3</div>,
            () => <div>4</div>,
            () => <div>5</div>,
          ]}
        />
      </Panel>
    </MainLayout>
  );
}
