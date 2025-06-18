import { Controller, useForm } from "react-hook-form";

import { Avatar } from "../../ui/Avatar/Avatar";
import { Container } from "../../ui/Container/Container";
import { Form } from "../../ui/Form/Form";
import { InputNumber } from "../../ui/FormField/InputNumber/InputNumber";
import { InputText } from "../../ui/FormField/InputText/InputText";
import { useTranslation } from "react-i18next";

export type FormData = {
  name: string;
  avatar: string;
  share: {
    adults: number;
    children: number;
  };
};

type UserFormProps = {
  submitLabel: string;
  onSubmit: (data: FormData) => void;
};

export function UserForm({ submitLabel, onSubmit }: UserFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      share: {
        adults: 0,
        children: 0,
      },
    },
    mode: "onChange",
  });

  const hasError = Object.keys(errors).length > 0;
  const name = watch("name");

  return (
    <Form
      handleSubmit={handleSubmit}
      submit={{
        label: submitLabel,
        onClick: onSubmit,
      }}
      hasError={hasError}
    >
      <Container
        styles={{
          display: "flex",
          justifyContent: "center",
          gap: "m",
        }}
      >
        <Avatar label={name} size="xl" />
      </Container>
      <Controller
        name="name"
        control={control}
        render={({ field: { value, onChange } }) => (
          <InputText
            type="text"
            label={t("userForm.name.label")}
            value={value}
            onChange={onChange}
            isRequired
          />
        )}
      />
      <Controller
        control={control}
        name="share.adults"
        rules={{
          required: t("userForm.adults.validation.required"),
          min: {
            value: 0,
            message: t("userForm.adults.validation.min"),
          },
          validate: (value) => {
            const children = getValues("share.children");
            if (value + children === 0) {
              return t("userForm.multipliers.validation.min");
            }
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputNumber
            type="number"
            as="number"
            label={t("userForm.adults.label")}
            value={value}
            isRequired
            onChange={(a) => {
              onChange(a);
              trigger("share.children");
            }}
            error={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="share.children"
        rules={{
          required: t("userForm.multipliers.validation.min"),
          min: {
            value: 0,
            message: t("userForm.children.validation.required"),
          },
          validate: (value) => {
            const adults = getValues("share.adults");
            if (value + adults === 0) {
              return t("userForm.multipliers.validation.min");
            }
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputNumber
            type="number"
            as="number"
            label={t("userForm.children.label")}
            value={value}
            isRequired
            onChange={(a) => {
              onChange(a);
              trigger("share.adults");
            }}
            error={error?.message}
          />
        )}
      />
    </Form>
  );
}
