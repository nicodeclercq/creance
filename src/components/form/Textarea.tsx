import React, { TextareaHTMLAttributes } from "react";
import { css } from "@emotion/css";
import { FieldError } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage";

type Props = {
  errors?: FieldError;
  messages?: Record<string, string>;
  onChange: (value: string) => void;
};

const wrapperStyles = css({
  display: "inline-flex",
  flexDirection: "column",
  width: "100%",
});
const inputStyles = css({
  width: "100%",
  maxWidth: "100%",
});

export function Textarea({
  onChange,
  errors,
  disabled,
  messages,
  ...rest
}: Props &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "className" | "style" | "onChange"
  >) {
  return (
    <div className={wrapperStyles}>
      <textarea
        {...rest}
        disabled={disabled}
        className={inputStyles}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        style={{ minHeight: "10rem" }}
      />
      {errors && <ErrorMessage errors={errors} messages={messages} />}
    </div>
  );
}
