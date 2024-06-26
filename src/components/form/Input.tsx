import { css } from "@emotion/css";
import React, { ChangeEvent, InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import { InputText as BaseInputText } from "primereact/inputtext";
import {
  InputNumber as BaseInputNumber,
  InputNumberChangeEvent,
} from "primereact/inputnumber";
import { VAR, padding, radius, font } from "../../theme/style";
import { ErrorMessage } from "./ErrorMessage";

type NumberInputProps = {
  onChange: (value: number | undefined) => void;
  type: "number" | "range";
};
type OtherInputProps = {
  onChange: (value: string) => void;
  type:
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "image"
    | "month"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
};

const isNumberInputProps = (
  args: NumberInputProps | OtherInputProps
): args is NumberInputProps => args.type === "number" || args.type === "range";

type Props = (NumberInputProps | OtherInputProps) & {
  theme: "base" | "neutral";
  errors?: FieldError;
  messages?: Record<string, string>;
  width?: string;
  step?: number;
  min?: number;
  max?: number;
};

const wrapperStyle = css({
  display: "inline-flex",
  flexDirection: "column",
});

const style = css(`
  ${padding("M")}
  ${radius("INTERACTIVE")}
  ${font("TEXT", "M")}
  background: ${VAR.COLOR.COMMON.SURFACE.BASE};
  border: 1px solid currentColor;
  box-shadow: ${VAR.SHADOW.INPUT};
  

  &:focus {
    outline: 2px solid ${VAR.COLOR.ACCENT.MAIN.WEAK};
    outline-offset: 2px;
  }
`);

export function Input({
  onChange,
  type,
  theme,
  errors,
  disabled,
  messages,
  value,
  width,
  ...rest
}: Props &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "className" | "style" | "onChange" | "step" | "min" | "max"
  >) {
  const Component = isNumberInputProps({ onChange, type } as
    | NumberInputProps
    | OtherInputProps)
    ? BaseInputNumber
    : BaseInputText;

  return (
    <div
      className={wrapperStyle}
      style={
        width
          ? { width }
          : { width: "min-content", minWidth: "10rem", maxWidth: "100%" }
      }
    >
      <Component
        {...rest}
        defaultValue={value}
        disabled={disabled}
        type={type}
        style={{
          color: errors != null ? VAR.COLOR.NEGATIVE.MAIN.BASE : "inherit",
          minWidth: width != null ? width : "5rem",
        }}
        onChange={(e) => {
          const props = { onChange, type } as
            | NumberInputProps
            | OtherInputProps;
          if (isNumberInputProps(props)) {
            try {
              const value = (e as InputNumberChangeEvent).value ?? undefined;
              props.onChange(value);
            } catch {
              props.onChange(undefined);
            }
          } else {
            const value = (e as ChangeEvent<HTMLInputElement>).target.value;
            props.onChange(value);
          }
        }}
      />
      {errors && <ErrorMessage errors={errors} messages={messages} />}
    </div>
  );
}
