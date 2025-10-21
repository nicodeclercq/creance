import * as Either from "fp-ts/Either";

import { Controller, type UseFormSetError } from "react-hook-form";
import type { Expense } from "../../../models/Expense";
import { expenseSchema } from "../../../models/Expense";
import { fromExpense, toExpense } from "./formExpense";
import { Avatar } from "../../../ui/Avatar/Avatar";
import type { ButtonProps } from "../../../ui/Button/Button";
import { CategoryIcon } from "../../../ui/CategoryIcon/CategoryIcon";
import type { CategoryIconName } from "../../../ui/CategoryIcon/private";
import { Columns } from "../../../ui/Columns/Columns";
import type { DistributiveOmit } from "../../../helpers/DistributiveOmit";
import { ErrorMessage } from "../../../ui/FormField/ErrorMessage/ErrorMessage";
import type { Event } from "../../../models/Event";
import { Form } from "../../../ui/Form/Form";
import { Grid } from "../../../ui/Grid/Grid";
import { InputDate } from "../../../ui/FormField/InputDate/InputDate";
import { InputNumber } from "../../../ui/FormField/InputNumber/InputNumber";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Logger } from "../../../service/Logger";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import type { Participant } from "../../../models/Participant";
import { RadioGroup } from "../../../ui/Form/RadioGroup/RadioGroup";
import { Select } from "../../../ui/FormField/Select/Select";
import type { Transaction } from "../../../models/Transaction";
import { asNumber } from "../../../helpers/Number";
import { depositSchema } from "../../../models/Deposit";
import type { i18n } from "i18next";
import { pipe } from "fp-ts/function";
import { useCurrentUser } from "../../../store/useCurrentUser";
import { useForm } from "../../../hooks/useForm";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const formSchema = z
  .object({
    mode: z.enum(["expense", "deposit"]),
    amount: expenseSchema.shape.amount,
    date: expenseSchema.shape.date,
    note: expenseSchema.shape.reason,
    from: expenseSchema.shape.lender,
    _id: expenseSchema.shape._id,
    updatedAt: expenseSchema.shape.updatedAt,
    category: expenseSchema.shape.category,
    share: z.object({
      type: z.enum(["default", "percentage", "fixed"]),
      percentageParticipant: z.record(z.string(), z.string()),
      fixedParticipant: z.record(z.string(), z.string()),
    }),
    to: depositSchema.shape.to,
  })
  .superRefine((data, ctx) => {
    // Deposit mode: from and to must be different
    if (data.mode === "deposit" && data.from === data.to) {
      ctx.addIssue({
        code: "custom",
        message: "TransactionForm.validation.from.isDifferent",
        path: ["from"],
      });
    }

    // Expense mode: validate share
    if (data.mode === "expense") {
      if (data.share.type === "percentage") {
        const sum = Object.values(data.share.percentageParticipant).reduce(
          (acc: number, val) => acc + asNumber(val),
          0
        );

        if (sum === 0) {
          ctx.addIssue({
            code: "custom",
            message: "TransactionForm.validation.share.percentageSum",
            path: ["share"],
          });
        }

        // Check for negative percentages
        Object.entries(data.share.percentageParticipant).forEach(
          ([_participantId, value]) => {
            if (asNumber(value) < 0) {
              ctx.addIssue({
                code: "custom",
                message: "TransactionForm.validation.share.positive",
                path: ["share"],
              });
            }
          }
        );
      } else if (data.share.type === "fixed") {
        const sum = Object.values(data.share.fixedParticipant).reduce(
          (acc: number, val) => acc + asNumber(val),
          0
        );

        if (sum !== asNumber(data.amount)) {
          ctx.addIssue({
            code: "custom",
            message: "TransactionForm.validation.share.fixedSum",
            path: ["share"],
          });
        }

        // Check for negative fixed amounts
        Object.entries(data.share.fixedParticipant).forEach(
          ([_participantId, value]) => {
            if (asNumber(value) < 0) {
              ctx.addIssue({
                code: "custom",
                message: "TransactionForm.validation.share.positive",
                path: ["share"],
              });
            }
          }
        );
      }
    }
  });

type FormData = z.infer<typeof formSchema>;

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

export type Props = {
  event: Event;
  participants: Record<string, Participant>;
  defaultValues: Transaction;
  submitLabel: string;
  onSubmit: (result: Transaction) => void;
  cancel: DistributiveOmit<ButtonProps, "variant">;
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
  } = useForm(formSchema, {
    defaultValues: toFormData(defaultValues, participants, event),
    mode: "onChange",
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
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputNumber
            as="string"
            type="number"
            unit="€"
            label={t("page.event.add.form.field.amount.label")}
            value={value}
            isRequired
            onChange={onChange}
            error={error?.message}
          />
        )}
      />
      <Controller
        name="date"
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputDate
            type="date"
            label={t("page.event.add.form.field.date.label")}
            isRequired
            value={value}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />
      <Controller
        name="note"
        control={control}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputText
            type="text"
            label={
              currentMode === "expense"
                ? t("page.event.add.form.field.label.label")
                : t("depositForm.note")
            }
            value={value}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />

      {currentMode === "expense" && (
        <>
          <Controller
            name="share.type"
            control={control}
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
