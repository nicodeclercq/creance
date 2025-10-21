import { Controller, useForm } from "react-hook-form";

import { Avatar } from "../../ui/Avatar/Avatar";
import { Container } from "../../ui/Container/Container";
import { Form } from "../../ui/Form/Form";
import { InputNumber } from "../../ui/FormField/InputNumber/InputNumber";
import { InputText } from "../../ui/FormField/InputText/InputText";
import type { User } from "../../models/User";
import { useTranslation } from "react-i18next";
import { userSchema } from "../../models/User";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createParticipantFormSchema = (
  t: ReturnType<typeof useTranslation>["t"],
  users: Record<string, User>
) =>
  z
    .object({
      name: userSchema.shape.name
        .min(1)
        .refine(
          (value) => !Object.values(users).some((user) => user.name === value),
          t("participantForm.name.validation.unique")
        ),
      avatar: userSchema.shape.avatar,
      share: userSchema.shape.share,
    })
    .superRefine((data, ctx) => {
      if (data.share.adults + data.share.children === 0) {
        ctx.addIssue({
          code: "custom",
          message: t("participantForm.multipliers.validation.min"),
          path: ["share", "adults"],
        });
        ctx.addIssue({
          code: "custom",
          message: t("participantForm.multipliers.validation.min"),
          path: ["share", "children"],
        });
      }
    });

export type FormData = z.infer<ReturnType<typeof createParticipantFormSchema>>;

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
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: defaultValue,
    mode: "onChange",
    resolver: zodResolver(createParticipantFormSchema(t, users)),
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
