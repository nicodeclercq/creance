import { Controller, useForm } from "react-hook-form";

import { Avatar } from "../../ui/Avatar/Avatar";
import { Container } from "../../ui/Container/Container";
import { Form } from "../../ui/Form/Form";
import { InputNumber } from "../../ui/FormField/InputNumber/InputNumber";
import { InputText } from "../../ui/FormField/InputText/InputText";
import { User } from "../../models/User";
import { useTranslation } from "react-i18next";

export type FormData = {
  name: string;
  avatar: string;
  share: {
    adults: number;
    children: number;
  };
};

type ParticipantFormProps = {
  defaultValue: FormData;
  submitLabel: string;
  onSubmit: (data: FormData) => void;
  cancel?: {
    label: string;
    onCancel: () => void;
  };
  users: Record<string, User>;
};

export function ParticipantForm({
  defaultValue,
  submitLabel,
  onSubmit,
  cancel,
  users = {},
}: ParticipantFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: defaultValue,
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
      cancel={
        cancel
          ? {
              label: cancel?.label,
              onClick: cancel?.onCancel,
            }
          : undefined
      }
      hasError={hasError}
    >
      <Container
        styles={{
          display: "flex",
          justifyContent: "center",
          gap: "m",
        }}
      >
        <Avatar label={name} image={users[name]?.avatar} size="xl" />
      </Container>
      <Controller
        name="name"
        control={control}
        rules={{
          required: true,
          maxLength: {
            value: 100,
            message: t("participantForm.name.validation.maxLength", {
              max: 100,
            }),
          },
          validate: (value) => {
            if (Object.values(users).some((user) => user.name === value)) {
              return t("participantForm.name.validation.unique");
            }
          },
        }}
        render={({ field: { value, onChange } }) => (
          <InputText
            type="text"
            label={t("participantForm.name.label")}
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
          required: t("participantForm.adults.validation.required"),
          min: {
            value: 0,
            message: t("participantForm.adults.validation.min"),
          },
          validate: (value) => {
            const children = getValues("share.children");
            if (value + children === 0) {
              return t("participantForm.multipliers.validation.min");
            }
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputNumber
            type="number"
            as="number"
            label={t("participantForm.adults.label")}
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
          required: t("participantForm.multipliers.validation.min"),
          min: {
            value: 0,
            message: t("participantForm.children.validation.required"),
          },
          validate: (value) => {
            const adults = getValues("share.adults");
            if (value + adults === 0) {
              return t("participantForm.multipliers.validation.min");
            }
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputNumber
            type="number"
            as="number"
            label={t("participantForm.children.label")}
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
