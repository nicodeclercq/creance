import React, { useCallback, useMemo } from "react";
import { css } from "@emotion/css";
import {
  useForm,
  Controller,
  FieldError,
  FieldValues,
  Path,
  DeepPartial,
} from "react-hook-form";
import { v4 as uuid } from "uuid";
import { pipe } from "fp-ts/function";
import * as Record from "fp-ts/Record";
import { Button } from "../Button";
import { Input } from "./Input";
import { Select } from "./Select";
import { Label } from "./Label";
import { createArray } from "../../infrastructure/array";
import { VAR } from "../../theme/style";
import { Fn } from "../../../@types/function";
import { fold } from "../../infrastructure/fold";
import { Checkbox } from "./Checkbox";
import { Radio } from "./Radio";
import {
  BooleanValue,
  Fields,
  FormValue,
  Key,
  NumberValue,
  PrimitiveValue,
  StringValue,
  Value,
  Values,
  ValueFromList,
  isBooleanValue,
  isNumberValue,
  isStringValue,
  isValueFromList,
} from "./formField";
import { Flex } from "../layout/flex";
import { delay } from "../../infrastructure/function";

const MAX_OPTIONS_BEFORE_SELECT = 5;

const actionsStyle = css({
  display: "flex",
  width: "100%",
  gap: VAR.SIZE.GAP.XS,
});
const fieldStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: VAR.SIZE.GAP.XXS,
});

type SubmitMode = "fullWidth" | "justifyEnd" | "submitOnBlur";

type Props<F extends Fields<any>> = {
  fields: F;
  onSubmit: (result: Values<F>) => void;
  onCancel?: () => void;
  template?: Array<Key<F> | Key<F>[]>;
  submitMode?: SubmitMode;
};

export function Form<T extends Fields<any>>({
  template,
  onCancel,
  fields,
  onSubmit,
  submitMode = "fullWidth",
}: Props<T>) {
  type Name = keyof Values<T> extends string
    ? keyof Values<T> extends Path<Values<T>>
      ? keyof Values<T>
      : never
    : never;

  const submitOnBlur = submitMode === "submitOnBlur";
  const formId = uuid();
  const defaultValues = useMemo(
    () =>
      pipe(
        fields,
        Record.map((definition: FormValue) => definition.defaultValue),
        (a) => a as Values<T>
      ),
    [fields]
  );

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Values<T>>({
    defaultValues: defaultValues as unknown as DeepPartial<Values<T>>,
  });

  const submitHandler = useMemo(
    () => handleSubmit((record: FieldValues) => onSubmit(record as Values<T>)),
    [handleSubmit, onSubmit]
  );

  const NumberInput = useCallback(
    ({ name, id, config }: { name: Name; id: string; config: NumberValue }) => (
      <Controller<Values<T>, Name>
        name={name}
        defaultValue={defaultValues[name]}
        control={control}
        rules={{
          required: config.isRequired,
          min: config.min,
          max: config.max,
        }}
        render={({
          field: { value, onChange },
        }: {
          field: {
            value: Value<T, Name>;
            onChange: Fn<Value<T, Name>, void>;
          };
        }) => (
          <>
            <Input
              id={id}
              value={value}
              errors={errors[name] as FieldError}
              type="text"
              inputMode="numeric"
              theme="neutral"
              max={config.max}
              min={config.min}
              onChange={onChange}
              onBlur={submitOnBlur ? submitHandler : undefined}
              width="100%"
            />
          </>
        )}
      />
    ),
    [control, defaultValues, errors, submitHandler, submitOnBlur]
  );
  const StringInput = useCallback(
    ({ name, id, config }: { name: Name; id: string; config: StringValue }) => (
      <Controller<Values<T>, Name>
        name={name}
        defaultValue={defaultValues[name]}
        control={control}
        rules={{ required: config.isRequired, validate: config.validate }}
        render={({
          field: { value, onChange },
        }: {
          field: {
            value: Value<T, Name>;
            onChange: Fn<Value<T, Name>, void>;
          };
        }) => (
          <>
            <Input
              id={id}
              value={value}
              errors={errors[name] as FieldError}
              type={config.kind ?? "text"}
              theme="neutral"
              onChange={onChange}
              autoComplete={config.autocomplete}
              onBlur={submitOnBlur ? submitHandler : undefined}
              width="100%"
            />
          </>
        )}
      />
    ),
    [control, defaultValues, errors, submitHandler, submitOnBlur]
  );
  const CheckboxInput = useCallback(
    ({
      name,
      id,
      config,
    }: {
      name: Name;
      id: string;
      config: BooleanValue;
    }) => (
      <Controller<Values<T>, Name>
        name={name}
        defaultValue={defaultValues[name]}
        control={control}
        rules={{ required: config.isRequired, validate: config.validate }}
        render={({
          field: { value, onChange },
        }: {
          field: {
            value: Value<T, Name>;
            onChange: Fn<Value<T, Name>, void>;
          };
        }) => (
          <>
            <Checkbox
              id={id}
              label={config.label}
              value={value}
              name={name}
              errors={errors[name] as FieldError}
              onChange={onChange}
              onBlur={submitOnBlur ? submitHandler : undefined}
              width="100%"
            />
          </>
        )}
      />
    ),
    [control, defaultValues, errors, submitHandler, submitOnBlur]
  );

  const ListInput = useCallback(
    ({
      options,
      name,
      isRequired = false,
      isMulti = false,
    }: {
      options: { label: string; value: string | number }[];
      name: Name;
      isMulti?: boolean;
      isRequired?: boolean;
    }) => {
      const optionsNumber = options.length;

      return (
        <Controller<Values<T>, Name>
          name={name}
          defaultValue={defaultValues[name]}
          control={control}
          rules={{ required: isRequired }}
          render={({
            field: { value, onChange },
          }: {
            field: {
              value: Value<T, Name>;
              onChange: Fn<Value<T, Name>, void>;
            };
          }) => {
            if (optionsNumber <= MAX_OPTIONS_BEFORE_SELECT) {
              return (
                <Flex direction="HORIZONTAL" wraps gap="M">
                  {options.map(({ label, value }) =>
                    isMulti ? (
                      <Checkbox
                        id={`input-${name as string}-${value}`}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onBlur={submitOnBlur ? submitHandler : undefined}
                        label={label}
                        width="100%"
                      />
                    ) : (
                      <Radio
                        id={`input-${name as string}-${value}`}
                        name={name}
                        value={value}
                        onChange={(e) => {
                          onChange(e);
                          if (submitOnBlur) {
                            delay().then(() => submitHandler());
                          }
                        }}
                        onBlur={submitOnBlur ? submitHandler : undefined}
                        label={label}
                        width="100%"
                      />
                    )
                  )}
                </Flex>
              );
            }

            return (
              <>
                <Select
                  id={`input-${name as string}`}
                  value={value}
                  onChange={onChange}
                  options={options}
                  multiple={isMulti}
                  width="100%"
                />
              </>
            );
          }}
        />
      );
    },
    [control, defaultValues, errors, submitHandler, submitOnBlur]
  );
  const toOptions = useCallback(
    <T extends PrimitiveValue>({
      options,
    }: ValueFromList<T>): {
      label: string;
      value: string | number;
    }[] =>
      options.map((option) =>
        typeof option === "object"
          ? option
          : { label: `${option}`, value: option }
      ),
    []
  );

  const hasError = Object.keys(errors).length > 0;

  const columnsNb = useMemo(() => {
    if (!template) {
      return 1;
    }
    return template
      .map((row) => (row instanceof Array ? row : [row]))
      .reduce((acc, cur) => (acc !== cur.length ? acc * cur.length : acc), 1);
  }, [template]);
  const gridTemplateColumns = useMemo(
    () => createArray(columnsNb, "1fr").join(" "),
    [columnsNb]
  );
  const gridTemplateRows = useMemo(
    () =>
      template != undefined
        ? template.map(() => "min-content min-content").join(" ")
        : Object.keys(fields).fill("min-content min-content").join(" "),
    [template, fields]
  );
  const gridTemplateAreas = useMemo(() => {
    if (!template) {
      return Object.keys(fields)
        .map((fieldName) => `"field-${fieldName}"`)
        .join(" ");
    }
    return template
      .map((row) => (row instanceof Array ? row : [row]))
      .map((row) => {
        const colSpan = (columnsNb * 2 - row.length) / row.length;
        return row
          .map(
            (fieldName) =>
              `${createArray(colSpan, `field-${fieldName as string}`).join(
                " "
              )}"`
          )
          .join(" ");
      })
      .join(" ");
  }, [columnsNb, fields, template]);

  const styles = useMemo(
    () =>
      css({
        gridTemplateAreas,
        gridTemplateColumns,
        gridTemplateRows,
        display: "grid",
        gap: VAR.SIZE.GAP.S,
      }),
    [gridTemplateColumns, gridTemplateRows, gridTemplateAreas]
  );

  const actionButtons = useMemo(
    () =>
      fold<SubmitMode, React.ReactNode>({
        fullWidth: () => (
          <>
            <Button onClick="submit" disabled={hasError} type="primary">
              Valider
            </Button>
            {onCancel && (
              <Button onClick={onCancel} disabled={hasError} type="secondary">
                Annuler
              </Button>
            )}
          </>
        ),
        justifyEnd: () => (
          <>
            {onCancel && (
              <Button onClick={onCancel} disabled={hasError} type="secondary">
                Annuler
              </Button>
            )}
            <Button onClick="submit" disabled={hasError} type="primary">
              Valider
            </Button>
          </>
        ),
        submitOnBlur: () => <></>,
      })(submitMode),
    [submitMode, hasError, onCancel]
  );

  return (
    <form onSubmit={submitHandler}>
      <div className={styles}>
        {Object.entries(fields).map(([name, value]) => (
          <div
            key={name as string}
            id={`field-${name as string}`}
            className={fieldStyle}
          >
            {!isBooleanValue(value) && (
              <Label
                asErrors={errors[name] != null}
                htmlFor={`input-${name as string}-${formId}`}
                gridArea={`label-${name as string}`}
              >
                {value.label}
              </Label>
            )}
            <div style={{ gridArea: `input-${name as string}` }}>
              {isValueFromList(value) ? (
                <ListInput
                  name={name as Name}
                  isMulti={false}
                  options={toOptions(value)}
                  isRequired={value.isRequired}
                />
              ) : isStringValue(value) ? (
                <StringInput
                  id={`input-${name as string}-${formId}`}
                  name={name as Name}
                  config={value}
                />
              ) : isNumberValue(value) ? (
                <NumberInput
                  id={`input-${name as string}-${formId}`}
                  name={name as Name}
                  config={value}
                />
              ) : isBooleanValue(value) ? (
                <CheckboxInput
                  id={`input-${name as string}-${formId}`}
                  name={name as Name}
                  config={value}
                />
              ) : (
                /* default */ <></>
              )}
            </div>
          </div>
        ))}
      </div>
      <div
        className={actionsStyle}
        style={
          submitMode === "fullWidth"
            ? { flexDirection: "column", alignItems: "stretch" }
            : { flexDirection: "row", justifyContent: "flex-end" }
        }
      >
        {actionButtons}
      </div>
    </form>
  );
}
