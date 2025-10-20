import * as Either from "fp-ts/Either";

import { Controller, UseFormSetError, useForm } from "react-hook-form";
import { asNumber, isValidCalculation } from "../../../helpers/Number";
import { fromExpense, toExpense } from "./formExpense";
import { i18n } from "i18next";

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
import { Grid } from "../../../ui/Grid/Grid";
import { InputDate } from "../../../ui/FormField/InputDate/InputDate";
import { InputNumber } from "../../../ui/FormField/InputNumber/InputNumber";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Logger } from "../../../service/Logger";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Participant } from "../../../models/Participant";
import { RadioGroup } from "../../../ui/Form/RadioGroup/RadioGroup";
import { Select } from "../../../ui/FormField/Select/Select";
import { Transaction } from "../../../models/Transaction";
import { pipe } from "fp-ts/function";
import { useCurrentUser } from "../../../store/useCurrentUser";
import { useTranslation } from "react-i18next";

type FormData = {
  mode: "expense" | "deposit";
  amount: string;
  date: Date;
  note: string;
  from: string;
  _id: string;
  updatedAt: Date;
  category: string;
  share: {
    type: "default" | "percentage" | "fixed";
    percentageParticipant: Record<string, string>;
    fixedParticipant: Record<string, string>;
  };
  to: string;
};

export type Props = {
  event: Event;
  participants: Record<string, Participant>;
  defaultValues: Transaction;
  submitLabel: string;
  onSubmit: (result: Transaction) => void;
  cancel: DistributiveOmit<ButtonProps, "variant">;
};

const toFormData = (
  transaction: Transaction,
  participants: Record<string, Participant>,
  event: Event
): FormData => {
  const isExpense = transaction.type === "expense";
  const formExpense = isExpense
    ? fromExpense(transaction.data, participants)
    : undefined;
  const defaultCategory = Object.values(event.categories)[0]?._id || "";
  const firstParticipant = Object.values(participants)[0]?._id || "";

  return {
    mode: isExpense ? "expense" : "deposit",
    _id: transaction.data._id,
    amount: transaction.data.amount,
    date: transaction.data.date,
    note: isExpense ? transaction.data.reason : transaction.data.note,
    from: isExpense ? transaction.data.lender : transaction.data.from,
    to: isExpense ? firstParticipant : transaction.data.to,
    category: isExpense ? transaction.data.category : defaultCategory,
    share: isExpense
      ? formExpense!.share
      : {
          type: "default",
          percentageParticipant: Object.keys(participants).reduce(
            (acc, participant) => ({ ...acc, [participant]: "0" }),
            {} as Record<string, string>
          ),
          fixedParticipant: Object.keys(participants).reduce(
            (acc, participant) => ({ ...acc, [participant]: "0" }),
            {} as Record<string, string>
          ),
        },
    updatedAt: transaction.data.updatedAt,
  };
};

const fromFormData = (
  data: FormData,
  setError: UseFormSetError<FormData>,
  t: i18n["t"]
): Either.Either<Error, Transaction> => {
  return data.mode === "expense"
    ? pipe(
        toExpense(
          {
            _id: data._id,
            reason: data.note,
            category: data.category,
            lender: data.from,
            amount: data.amount,
            date: data.date,
            share: data.share,
            updatedAt: data.updatedAt,
          },
          setError as any,
          t
        ),
        Either.map(
          (expense: Expense): Transaction => ({
            type: "expense",
            data: expense,
          })
        )
      )
    : Either.right({
        type: "deposit",
        data: {
          _id: data._id,
          amount: data.amount,
          from: data.from,
          to: data.to,
          note: data.note,
          date: data.date,
          updatedAt: new Date(),
        },
      });
};

export function TransactionForm({
  event,
  participants,
  defaultValues,
  onSubmit,
  submitLabel,
  cancel,
}: Props) {
  const { t } = useTranslation();
  const { isCurrentUser } = useCurrentUser();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    trigger,
  } = useForm<FormData>({
    defaultValues: toFormData(defaultValues, participants, event),
    mode: "onChange",
    resolver: (data) => {
      const errors: Record<string, { message: string }> = {};

      if (data.amount.length > 100) {
        errors.amount = {
          message: t("validation.maxLength", { field: "amount", max: 100 }),
        };
      }

      if (!isValidCalculation(data.amount)) {
        errors.amount = {
          message: t("page.event.add.form.field.amount.validation.isNumber"),
        };
      }
      const amount = asNumber(data.amount);
      if (amount <= 0) {
        const params = /[+*-/]/.test(data.amount)
          ? {
              isCalculated: true,
              result: amount,
              calculation: data.amount,
            }
          : { isCalculated: false };
        errors.amount = {
          message: t(
            "page.event.add.form.field.amount.validation.positive",
            params
          ),
        };
      }

      if (data.note.length > 100) {
        errors.note = {
          message: t("validation.maxLength", { field: "note", max: 100 }),
        };
      }

      if (data.from.length > 100) {
        errors.from = {
          message: t("validation.maxLength", { field: "from", max: 100 }),
        };
      }

      if (data.mode === "expense") {
        if (data.category.length > 100) {
          errors.category = {
            message: t("validation.maxLength", { field: "category", max: 100 }),
          };
        }
        if (data.share.type === "percentage") {
          const sum = Object.values(data.share.percentageParticipant).reduce(
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
          const sum = Object.values(data.share.fixedParticipant).reduce(
            (acc, val) => acc + asNumber(val),
            0
          );

          if (sum !== asNumber(data.amount)) {
            errors.share = {
              message: t(
                "page.event.add.form.field.share.fixed.validation.sum",
                {
                  sum,
                  amount: data.amount,
                }
              ),
            };
          }

          Object.values(participants).forEach((participant) => {
            if (data.share.type === "fixed") {
              const value = asNumber(
                data.share.fixedParticipant[participant._id]
              );
              if (value < 0) {
                errors.share = {
                  message: t(
                    "page.event.add.form.field.share.fixed.validation.positive"
                  ),
                };
              }
            }
            if (data.share.type === "percentage") {
              const value = asNumber(
                data.share.percentageParticipant[participant._id]
              );
              if (value < 0) {
                errors.share = {
                  message: t(
                    "page.event.add.form.field.share.fixed.validation.positive"
                  ),
                };
              }
            }
          });
        }
      } else if (data.mode === "deposit") {
        if (data.to.length > 100) {
          errors.to = {
            message: t("validation.maxLength", { field: "to", max: 100 }),
          };
        }

        if (data.from === data.to) {
          errors.from = {
            message: t("depositForm.participants.validation.isDifferent"),
          };
        }
      }

      return { values: data, errors };
    },
  });

  const submit = (data: FormData) => {
    const transaction = fromFormData(data, setError, t);
    if (Either.isLeft(transaction)) {
      Logger.error("Invalid transaction")(transaction.left);
      return;
    }
    onSubmit(transaction.right);
  };

  const hasError = Object.keys(errors).length > 0;
  const currentMode = watch("mode");
  const currentShareType = watch("share.type");
  const currentFrom = watch("from");
  const currentTo = watch("to");

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
        name="mode"
        control={control}
        rules={{ required: true }}
        render={({ field: { value, onChange } }) => (
          <RadioGroup
            label={t("transactionForm.mode.label")}
            value={value}
            isRequired
            onChange={onChange}
            options={[
              {
                id: "expense",
                label: t("transactionForm.mode.option.expense.label"),
                value: "expense",
              },
              {
                id: "deposit",
                label: t("transactionForm.mode.option.deposit.label"),
                value: "deposit",
              },
            ]}
          />
        )}
      />

      <Controller
        name="from"
        control={control}
        rules={{
          validate: (value) =>
            currentMode === "deposit" && value === currentTo
              ? t("depositForm.participants.validation.isDifferent")
              : true,
        }}
        render={({ field: { value, onChange } }) => (
          <Select
            label={
              currentMode === "expense"
                ? t("page.event.add.form.field.lender.label")
                : t("depositForm.from")
            }
            value={value}
            onChange={(a) => {
              onChange(a);
              if (currentMode === "deposit") {
                trigger("to");
              }
            }}
            valueRenderer={({ value }) => (
              <Avatar
                label={participants[value]?.name}
                image={participants[value]?.avatar}
                size="m"
              />
            )}
            options={Object.keys(event.participants).map(
              (participant, index) => ({
                id: participant ?? index,
                label: isCurrentUser(participants[participant])
                  ? t("currentUser.anonymous.name")
                  : participants[participant].name ?? t("participant.unknown"),
                value:
                  participants[participant]?._id ?? t("participant.unknown"),
              })
            )}
          />
        )}
      />

      {currentMode === "expense" && (
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
      )}

      {currentMode === "deposit" && (
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
                <Avatar
                  label={participants[value]?.name}
                  image={participants[value]?.avatar}
                  size="m"
                />
              )}
              options={Object.keys(event.participants).map(
                (participant, index) => ({
                  id: participant ?? index,
                  label: isCurrentUser(participants[participant])
                    ? t("currentUser.anonymous.name")
                    : participants[participant].name ??
                      t("participant.unknown"),
                  value:
                    participants[participant]?._id ?? t("participant.unknown"),
                })
              )}
            />
          )}
        />
      )}

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
        name="note"
        control={control}
        render={({ field: { value, onChange } }) => (
          <InputText
            type="text"
            label={
              currentMode === "expense"
                ? t("page.event.add.form.field.label.label")
                : t("depositForm.note")
            }
            value={value}
            onChange={onChange}
          />
        )}
      />

      {currentMode === "expense" && (
        <>
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
            {t(
              `page.event.add.form.field.share.type.${currentShareType}.description`
            )}
          </Paragraph>

          {currentShareType === "percentage" &&
            Object.values(participants).map((participant) => (
              <Controller
                key={participant._id}
                name={`share.percentageParticipant.${participant._id}`}
                control={control}
                rules={{
                  required: true,
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <Grid columns={["1fr", "min-content"]} gap="m">
                    <Columns align="center" gap="s" styles={{ flexGrow: true }}>
                      <Avatar
                        label={participant.name}
                        image={participant.avatar}
                      />
                      <Paragraph>
                        {isCurrentUser(participant)
                          ? t("currentUser.anonymous.name")
                          : participant.name}
                      </Paragraph>
                    </Columns>
                    <InputNumber
                      as="number"
                      type="number"
                      label={t(
                        "page.event.add.form.field.share.percentage.amount.label"
                      )}
                      value={isNaN(Number(value)) ? 0 : Number(value)}
                      isRequired
                      onChange={(v) => {
                        onChange(String(v));
                        trigger("share");
                      }}
                      error={error?.message}
                    />
                  </Grid>
                )}
              />
            ))}

          {currentShareType === "fixed" &&
            Object.values(participants).map((participant) => (
              <Controller
                key={participant._id}
                name={`share.fixedParticipant.${participant._id}`}
                control={control}
                rules={{
                  required: true,
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <Columns gap="m">
                    <Columns align="center" gap="s" styles={{ flexGrow: true }}>
                      <Avatar
                        label={participant.name}
                        image={participant.avatar}
                      />
                      <Paragraph>
                        {isCurrentUser(participant)
                          ? t("currentUser.anonymous.name")
                          : participant.name}
                      </Paragraph>
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

          {errors.share?.message && (
            <ErrorMessage message={errors.share.message} />
          )}
        </>
      )}
    </Form>
  );
}
