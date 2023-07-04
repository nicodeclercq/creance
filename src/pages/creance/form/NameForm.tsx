import React from "react";
import { Form } from "../../../components/form/Form";
import { stringValue } from "../../../components/form/formField";

type Props = {
  defaultValue: string;
  onSubmit: (values: { name: string; mode: string }) => void;
};

export function NameForm({ defaultValue, onSubmit }: Props) {
  return (
    <Form
      submitMode="submitOnBlur"
      fields={{
        name: stringValue({
          defaultValue,
          label: "Nom de la liste de créances",
          isRequired: true,
        }),
        mode: {
          ...stringValue({
            label: "Répartition par défaut",
            defaultValue: "calendar",
            isRequired: true,
          }),
          options: [
            {
              label: "Définir sur une période",
              value: "calendar",
            },
            {
              label: "Définir par présence",
              value: "distribution",
            },
          ],
        },
      }}
      onSubmit={onSubmit}
    />
  );
}
