import { useEffect, useRef, useState } from "react";
import { openDialog } from "../../ui/DialogProvider/DialogStackHook";
import {
  LoginForm,
  type LoginFormData,
} from "../../pages/auth/private/LoginForm";
import styles from "../../pages/auth/private/LoginPage.module.css";
import { PigImage } from "../../ui/Pig";
import { useTranslation } from "react-i18next";

const isError = (data: unknown): data is Error => data instanceof Error;

export const createLoginDialog = (
  signIn: (data: LoginFormData) => Promise<string | Error>,
) =>
  openDialog<LoginFormData & { userId: string }>({
    title: "LoginForm.title",
    component: ({ onSubmit, onCancel }) => {
      const isMount = useRef(false);
      const [error, setError] = useState<string>();
      const [isSubmiting, setIsSubmiting] = useState(false);
      const { t } = useTranslation();

      useEffect(() => {
        isMount.current = true;

        return () => {
          isMount.current = false;
        };
      }, []);

      const submit = (data: LoginFormData) => {
        setIsSubmiting(true);

        return signIn(data)
          .then((result) => {
            return isError(result)
              ? Promise.reject(new Error("LoginForm.errors.invalidCredentials"))
              : onSubmit({ ...data, userId: result });
          })
          .catch((error: Error) => {
            if (isMount.current) {
              setError(error.message);
            }
          })
          .finally(() => {
            if (isMount.current) {
              setIsSubmiting(false);
            }
          });
      };

      return (
        <div>
          <div className={styles.pigContainer}>
            <PigImage width="25vw" />
          </div>
          <LoginForm
            onSubmit={submit}
            cancel={{
              onClick: onCancel,
              label: t("LoginForm.actions.continueAnonymously"),
            }}
            errorMessage={error}
            isLoading={isSubmiting}
          />
        </div>
      );
    },
  }).then((result) => (result.type === "submit" ? result.data : undefined));
