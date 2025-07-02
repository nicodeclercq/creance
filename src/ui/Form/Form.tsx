import { useState, type ReactNode } from "react";
import { Stack } from "../Stack/Stack";
import styles from "./Form.module.css";
import { AsButton, Button, ButtonProps } from "../Button/Button";
import { DistributiveOmit } from "../../helpers/DistributiveOmit";
import { FieldValues, type UseFormHandleSubmit } from "react-hook-form";

type FormProps<TFieldValues extends FieldValues, TTransformedValues> = {
  hasError: boolean;
  handleSubmit: UseFormHandleSubmit<TFieldValues, TTransformedValues>;
  children: ReactNode;
  steps?: {
    current: number;
    total: number;
  };
  submit: DistributiveOmit<ButtonProps<AsButton>, "variant" | "onClick"> & {
    onClick: (data: TTransformedValues) => void | Promise<void>;
  };
  cancel?: DistributiveOmit<ButtonProps, "variant">;
};

type FormLayoutProps = {
  children: ReactNode;
  steps?: {
    current: number;
    total: number;
  };
  cancel?: DistributiveOmit<ButtonProps, "variant">;
  submit: DistributiveOmit<ButtonProps<AsButton>, "variant" | "onClick"> & {
    onClick: () => void;
  };
  isLoading: boolean;
  hasError: boolean;
};

export function FormLayout({
  children,
  steps,
  cancel,
  submit,
  hasError,
  isLoading,
}: FormLayoutProps) {
  return (
    <Stack padding="l" gap="m" alignItems="stretch">
      {children}
      {steps && (
        <div>
          Étape {steps.current} sur {steps.total}
        </div>
      )}
      <div className={styles.formActions}>
        {cancel && (
          <Button
            {...cancel}
            type={(cancel.as === "button" ? "button" : undefined) as undefined}
            variant="secondary"
          />
        )}
        <Button
          {...submit}
          type="submit"
          variant="primary"
          isLoading={isLoading}
          isDisabled={hasError}
        />
      </div>
    </Stack>
  );
}

export function Form<TFieldValues extends FieldValues, TTransformedValues>({
  hasError,
  handleSubmit,
  children,
  steps,
  submit,
  cancel,
}: FormProps<TFieldValues, TTransformedValues>) {
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = () => {
    // do nothing submit is automatically handled by the form
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit((data) => {
        const result = submit.onClick(data);
        if (result instanceof Promise) {
          setIsLoading(true);
          result.finally(() => {
            setIsLoading(false);
          });
        }
      })}
    >
      <FormLayout
        hasError={hasError}
        isLoading={isLoading}
        submit={{ ...submit, onClick: submitForm }}
        cancel={cancel}
        steps={steps}
      >
        {children}
      </FormLayout>
    </form>
  );
}
