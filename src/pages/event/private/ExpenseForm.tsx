import * as Either from "fp-ts/Either";

import { Controller, useForm } from "react-hook-form";
import { FormExpense, toExpense } from "./formExpense";
import { asNumber, isValidCalculation } from "../../../helpers/Number";

import { Avatar } from "../../../ui/Avatar/Avatar";
import { ButtonProps } from "../../../ui/Button/Button";
import { CategoryIcon } from "../../../ui/CategoryIcon/CategoryIcon";
import { CategoryIconName } from "../../../ui/CategoryIcon/private";
import { Columns } from "../../../ui/Columns/Columns";
import { DistributiveOmit } from "../../../helpers/DistributiveOmit";
import { ErrorMessage } from "../../../ui/FormField/ErrorMessage/ErrorMessage";
import { Event } from "../../../models/Event";
import { Expense } from "../../../models/Expense";
import { Form } from "../../../ui/Form/Form";
import { InputDate } from "../../../ui/FormField/InputDate/InputDate";
import { InputNumber } from "../../../ui/FormField/InputNumber/InputNumber";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { RadioGroup } from "../../../ui/Form/RadioGroup/RadioGroup";
import { Select } from "../../../ui/FormField/Select/Select";
import { User } from "../../../models/User";
import { useTranslation } from "react-i18next";

export type Props = {
  event: Event;
  users: Record<string, User>;
  defaultValues: FormExpense;
  submitLabel: string;
  onSubmit: (expense: Expense) => void;
  cancel: DistributiveOmit<ButtonProps, "variant">;
};

export function ExpenseForm({
  event,
  users,
  defaultValues,
  onSubmit,
  submitLabel,
  cancel,
}: Props) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    trigger,
  } = useForm<FormExpense>({
    defaultValues,
    mode: "onChange",
    resolver: (data) => {
      const errors: Record<string, { message: string }> = {};

      if (data.share.type === "percentage") {
        const sum = Object.values(data.share.percentageUser).reduce(
          (acc, val) => acc + asNumber(val),
          0
        );

        if (sum === 0) {
          errors.share = {
            message: t(
              "page.event.add.form.field.share.percentage.validation.sum"
            ),
          };
        }
      } else if (data.share.type === "fixed") {
        const sum = Object.values(data.share.fixedUser).reduce(
          (acc, val) => acc + asNumber(val),
          0
        );

        if (sum !== asNumber(data.amount)) {
          errors.share = {
            message: t("page.event.add.form.field.share.fixed.validation.sum", {
              sum,
              amount: data.amount,
            }),
          };
        }
      }

      return { values: data, errors };
    },
  });

  const submit = (data: FormExpense) => {
    const expense = toExpense(data, setError, t);
    if (Either.isLeft(expense)) {
      console.error("Invalid amount", expense.left);
      return;
    }
    onSubmit(expense.right);
  };

  const hasError = Object.keys(errors).length > 0;

  const currentType = watch("share.type");

  return (
    <Form
      handleSubmit={handleSubmit}
      submit={{
        label: submitLabel,
        onClick: submit,
      }}
      cancel={cancel}
      hasError={hasError}
    >
      <Controller
        name="lender"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            label={t("page.event.add.form.field.lender.label")}
            value={value}
            onChange={onChange}
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
        name="category"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Select
            label={t("page.event.add.form.field.category.label")}
            value={value}
            onChange={onChange}
            valueRenderer={({ value }) => (
              <CategoryIcon
                name={event.categories[value].icon as CategoryIconName}
                size="m"
                label={event.categories[value].name}
              />
            )}
            options={Object.values(event.categories).map((category) => ({
              id: category._id,
              label: category.name,
              value: category._id,
            }))}
          />
        )}
      />
      <Controller
        name="amount"
        control={control}
        rules={{
          required: true,
          validate: {
            isNumber: (value) =>
              isValidCalculation(value)
                ? true
                : t("page.event.add.form.field.amount.validation.isNumber"),
            positive: (value) => {
              const result = asNumber(value);

              if (result > 0) {
                return true;
              }
              const params = /[+*-/]/.test(value)
                ? {
                    isCalculated: true,
                    result,
                    calculation: value,
                  }
                : { isCalculated: false };

              return t(
                "page.event.add.form.field.amount.validation.positive",
                params
              );
            },
          },
        }}
        render={({ field: { value, onChange }, fieldState }) => (
          <InputNumber
            as="string"
            type="number"
            unit="€"
            label={t("page.event.add.form.field.amount.label")}
            value={value}
            isRequired
            onChange={onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="date"
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <InputDate
            type="date"
            label={t("page.event.add.form.field.date.label")}
            isRequired
            value={value}
            onChange={onChange}
          />
        )}
      />
      <Controller
        name="reason"
        control={control}
        render={({ field: { value, onChange } }) => (
          <InputText
            type="text"
            label={t("page.event.add.form.field.label.label")}
            value={value}
            onChange={onChange}
          />
        )}
      />
      <Controller
        name="share.type"
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <RadioGroup
            label={t("page.event.add.form.field.share.type.label")}
            value={value}
            isRequired
            onChange={onChange}
            options={[
              {
                id: "default",
                label: t(
                  "page.event.add.form.field.share.type.option.default.label"
                ),
                value: "default",
              },
              {
                id: "percentage",
                label: t(
                  "page.event.add.form.field.share.type.option.percentage.label"
                ),
                value: "percentage",
              },
              {
                id: "fixed",
                label: t(
                  "page.event.add.form.field.share.type.option.fixed.label"
                ),
                value: "fixed",
              },
            ]}
          />
        )}
      />

      <Paragraph styles={{ font: "body-small" }}>
        {t(`page.event.add.form.field.share.type.${currentType}.description`)}
      </Paragraph>
      {currentType === "percentage" &&
        Object.values(users).map((user) => (
          <Controller
            key={user._id}
            name={`share.percentageUser.${user._id}`}
            control={control}
            rules={{
              required: true,
              validate: (value) => {
                const result = asNumber(value);
                if (result < 0) {
                  return t(
                    "page.event.add.form.field.share.percentage.validation.positive"
                  );
                }
              },
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Columns gap="m">
                <Columns align="center" gap="s" styles={{ flexGrow: true }}>
                  <Avatar label={user.name} />
                  <Paragraph>{user.name}</Paragraph>
                </Columns>
                <InputNumber
                  as="string"
                  type="number"
                  label={t(
                    "page.event.add.form.field.share.percentage.amount.label"
                  )}
                  value={value}
                  isRequired
                  onChange={(v) => {
                    onChange(v);
                    trigger("share");
                  }}
                  error={error?.message}
                />
              </Columns>
            )}
          />
        ))}
      {watch("share.type") === "fixed" &&
        Object.values(users).map((user) => (
          <Controller
            key={user._id}
            name={`share.fixedUser.${user._id}`}
            control={control}
            rules={{
              required: true,
              validate: (value) => {
                const result = asNumber(value);
                if (result < 0) {
                  return t(
                    "page.event.add.form.field.share.fixed.validation.positive"
                  );
                }
              },
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Columns gap="m">
                <Columns align="center" gap="s" styles={{ flexGrow: true }}>
                  <Avatar label={user.name} />
                  <Paragraph>{user.name}</Paragraph>
                </Columns>
                <InputNumber
                  as="string"
                  type="number"
                  unit="€"
                  label={t(
                    "page.event.add.form.field.share.fixed.amount.label"
                  )}
                  value={value}
                  isRequired
                  onChange={(v) => {
                    onChange(v);
                    trigger("share");
                  }}
                  error={error?.message}
                />
              </Columns>
            )}
          />
        ))}
      {errors.share?.message && <ErrorMessage message={errors.share.message} />}
    </Form>
  );
}
