import React from "react";
import { Form } from "../../../components/form/Form";
import {
  stringValue,
  valuesFromList,
} from "../../../components/form/formField";
import { useUsers } from "../../../application/useUsers";
import { User } from "../../../domain/auth/User";

type Props = {
  defaultValue: User["uid"][];
  onSubmit: (values: { users: User["uid"][] }) => void;
};

export function UsersForm({ defaultValue, onSubmit }: Props) {
  const [users, setUsers] = useUsers();
  const usersField = valuesFromList(
    stringValue({
      label: "Liste des participants",
      isRequired: true,
    }),
    {
      defaultValue,
      options: Object.entries(users).map(
        ([uid, user]: [User["uid"], User]) => ({
          label: user.displayName,
          value: uid,
        })
      ),
    }
  );

  return (
    <Form
      submitMode="submitOnBlur"
      fields={{
        users: usersField,
      }}
      onSubmit={onSubmit}
    />
  );
}
