import * as z from "zod";

import { Controller } from "react-hook-form";
import { Form } from "../../../ui/Form/Form";
import { InputPassword } from "../../../ui/FormField/InputPassword/InputPassword";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { useForm } from "../../../hooks/useForm";
import { useTranslation } from "react-i18next";

const signupFormSchema = z.object({
  login: z.string().min(1).max(100),
  password: z.string().min(1).max(100),
});

export type SignupFormData = z.infer<typeof signupFormSchema>;

type SignupFormProps = {
  onSubmit: (data: SignupFormData) => Promise<void>;
  cancel: {
    onClick: () => void;
    label: string;
  };
  isLoading?: boolean;
  errorMessage?: string;
};

export function SignupForm({
  onSubmit,
  cancel,
  errorMessage,
  isLoading,
}: SignupFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(signupFormSchema, {
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
        label: t("SignupForm.actions.submit"),
        onClick: onSubmit,
      }}
      cancel={cancel}
    >
      <Paragraph
        styles={{
          font: "body-default",
          textAlign: "center",
          maxWidth: "64rem",
          padding: "m",
        }}
      >
        {t("SignupForm.description")}
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
            label={t("SignupForm.login.label")}
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
            label={t("SignupForm.password.label")}
            isRequired
            error={error?.message}
          />
        )}
      />
    </Form>
  );
}
