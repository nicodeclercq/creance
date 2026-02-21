import * as z from "zod";

import { Alert } from "../../../ui/Alert/Alert";
import { Controller } from "react-hook-form";
import { Form } from "../../../ui/Form/Form";
import { InputPassword } from "../../../ui/FormField/InputPassword/InputPassword";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { useForm } from "../../../hooks/useForm";
import { useTranslation } from "react-i18next";

const loginFormSchema = z.object({
  login: z.string().min(1).max(100),
  password: z.string().min(1).max(100),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

type LoginFormProps = {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  errorMessage?: string;
};

export function LoginForm({
  onSubmit,
  onCancel,
  errorMessage,
  isLoading,
}: LoginFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(loginFormSchema, {
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const hasError = Object.keys(errors).length > 0;

  return (
    <Form
      hasError={hasError}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      submit={{
        label: t("LoginForm.actions.submit"),
        onClick: onSubmit,
      }}
      cancel={{
        label: t("LoginForm.actions.continueAnonymously"),
        onClick: onCancel,
      }}
    >
      <Paragraph
        styles={{
          font: "body-default",
          textAlign: "center",
          maxWidth: "64rem",
          padding: "m",
        }}
      >
        {t("LoginForm.description")}
      </Paragraph>
      {errorMessage && (
        <Paragraph
          styles={{
            font: "body-default",
            textAlign: "center",
            color: "failure-default",
          }}
        >
          {errorMessage}
        </Paragraph>
      )}
      <Controller
        control={control}
        name="login"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputText
            type="text"
            value={value}
            onChange={onChange}
            label={t("LoginForm.login.label")}
            isRequired
            error={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputPassword
            type="password"
            value={value}
            onChange={onChange}
            label={t("LoginForm.password.label")}
            isRequired
            error={error?.message}
          />
        )}
      />
      <Alert type="subtle">{t("LoginForm.alert")}</Alert>
    </Form>
  );
}
