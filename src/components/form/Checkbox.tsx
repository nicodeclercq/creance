import React, { InputHTMLAttributes, useId } from "react";
import classNames from "classnames";
import { Checkbox as BaseCheckbox } from "primereact/checkbox";
import { FieldError } from "react-hook-form";
import { css } from "@emotion/css";
import { ErrorMessage } from "./ErrorMessage";
import { styles as labelDefaultStyle } from "./Label";
import { VAR } from "../../theme/style";

const wrapperStyle = css(`
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  flex-direction: row;
  gap: ${VAR.SIZE.GAP.XXS};
`);
const labelStyleOverride = css`
  margin-top: 2px;
`;

type Props = {
  name: string;
  label: string;
  onChange: (value: boolean) => void;
  errors?: FieldError;
  messages?: Record<string, string>;
};

export function Checkbox({
  id,
  label,
  onChange,
  errors,
  messages,
  checked,
  ...rest
}: Props &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "className" | "style" | "onChange"
  >) {
  const defaultId = useId();

  return (
    <label htmlFor={id ?? defaultId} className={wrapperStyle}>
      <BaseCheckbox
        {...rest}
        checked={checked ?? false}
        id={id ?? defaultId}
        onClick={(e) => onChange(e.target.checked ?? false)}
        onChange={(e) => onChange(e.target.checked ?? false)}
      />
      <span
        className={classNames(labelDefaultStyle, labelStyleOverride)}
        style={{
          color: errors ? VAR.COLOR.NEGATIVE.MAIN.BASE : "inherit",
        }}
      >
        {label}
      </span>
      {errors && <ErrorMessage errors={errors} messages={messages} />}
    </label>
  );
}
