import React from "react";
import { Form } from "../../../components/form/Form";
import { stringValue } from "../../../components/form/formField";

type Props = {
  defaultValue: string;
  onSubmit: (values: { name: string }) => void;
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
      }}
      onSubmit={onSubmit}
    />
  );
}
