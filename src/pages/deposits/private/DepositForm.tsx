import { Controller, useForm } from "react-hook-form";
import { asNumber, isValidCalculation } from "../../../helpers/Number";

import { Avatar } from "../../../ui/Avatar/Avatar";
import { Deposit } from "../../../models/Deposit";
import { Event } from "../../../models/Event";
import { Form } from "../../../ui/Form/Form";
import { InputNumber } from "../../../ui/FormField/InputNumber/InputNumber";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Select } from "../../../ui/FormField/Select/Select";
import { User } from "../../../models/User";
import { useTranslation } from "react-i18next";

type DepositFormProps = {
  defaultValue: Deposit;
  cancelLabel: string;
  onCancel: () => void;
  submitLabel: string;
  onSubmit: (deposit: Deposit) => void;
  users: Record<string, User>;
  event: Event;
};

export function DepositForm({
  defaultValue,
  onCancel,
  onSubmit,
  cancelLabel,
  submitLabel,
  users,
  event,
}: DepositFormProps) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<Deposit>({
    defaultValues: defaultValue,
    mode: "onChange",
  });

  const submit = (data: Deposit) => {
    onSubmit(data);
  };

  const hasError = Object.keys(errors).length > 0;

  const currentFrom = watch("from");
  const currentTo = watch("to");

  return (
    <Form
      handleSubmit={handleSubmit}
      submit={{
        label: submitLabel,
        onClick: submit,
      }}
      cancel={{
        label: cancelLabel,
        onClick: onCancel,
      }}
      hasError={hasError}
    >
      <Controller
        name="amount"
        control={control}
        rules={{
          required: true,
          validate: {
            isNumber: (value) =>
              isValidCalculation(value)
                ? true
                : t("depositForm.amount.validation.isNumber"),
            positive: (value) => {
              const result = asNumber(value);

              if (result > 0) {
                return true;
              }

              return t("depositForm.amount.validation.positive");
            },
          },
        }}
        render={({ field: { value, onChange }, fieldState }) => (
          <InputNumber
            as="string"
            type="number"
            unit="€"
            label={t("depositForm.amount")}
            value={value}
            isRequired
            onChange={onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="from"
        control={control}
        rules={{
          validate: (value) =>
            value === currentTo
              ? t("depositForm.participants.validation.isDifferent")
              : true,
        }}
        render={({ field: { value, onChange } }) => (
          <Select
            label={t("depositForm.from")}
            value={value}
            onChange={(a) => {
              onChange(a);
              trigger("to");
            }}
            valueRenderer={({ value }) => (
              <Avatar label={users[value]?.name} size="m" />
            )}
            options={Object.keys(event.shares).map((user, index) => ({
              id: user ?? index,
              label: users[user]?.name ?? "deleted user",
              value: users[user]?._id ?? "deleted user",
            }))}
          />
        )}
      />
      <Controller
        name="to"
        control={control}
        rules={{
          validate: (value) =>
            value === currentFrom
              ? t("depositForm.participants.validation.isDifferent")
              : true,
        }}
        render={({ field: { value, onChange } }) => (
          <Select
            label={t("depositForm.to")}
            value={value}
            onChange={(a) => {
              onChange(a);
              trigger("from");
            }}
            valueRenderer={({ value }) => (
              <Avatar label={users[value]?.name} size="m" />
            )}
            options={Object.keys(event.shares).map((user, index) => ({
              id: user ?? index,
              label: users[user]?.name ?? "deleted user",
              value: users[user]?._id ?? "deleted user",
            }))}
          />
        )}
      />
      <Controller
        name="note"
        control={control}
        render={({ field: { value, onChange } }) => (
          <InputText
            type="text"
            label={t("depositForm.note")}
            value={value}
            onChange={onChange}
          />
        )}
      />
    </Form>
  );
}
