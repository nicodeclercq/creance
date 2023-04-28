import { css } from "@emotion/css";
import React, { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";
import { VAR, padding, radius } from "../../theme/style";
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
};

const wrapperStyle = css({
  display: "inline-flex",
  flexDirection: "column",
});

const style = css(`
  ${padding("M")}
  ${radius("INTERACTIVE")}
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
    "className" | "style" | "onChange"
  >) {
  return (
    <div
      className={wrapperStyle}
      style={
        width
          ? { width }
          : { width: "min-content", minWidth: "10rem", maxWidth: "100%" }
      }
    >
      <input
        {...rest}
        defaultValue={value}
        disabled={disabled}
        type={type}
        className={style}
        style={{
          color: errors != null ? VAR.COLOR.NEGATIVE.MAIN.BASE : "inherit",
          minWidth: width != null ? width : "5rem",
        }}
        onChange={(e) => {
          const value = e.target.value;
          const props = { onChange, type } as
            | NumberInputProps
            | OtherInputProps;
          if (isNumberInputProps(props)) {
            try {
              props.onChange(parseInt(value, 10));
            } catch {
              props.onChange(undefined);
            }
          } else {
            props.onChange(value);
          }
        }}
      />
      {errors && <ErrorMessage errors={errors} messages={messages} />}
    </div>
  );
}
