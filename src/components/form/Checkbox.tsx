import React, { InputHTMLAttributes, useId } from "react";
import classNames from "classnames";
import { FieldError } from "react-hook-form";
import { css } from "@emotion/css";
import { ErrorMessage } from "./ErrorMessage";
import { styles as labelDefaultStyle } from "./Label";
import { VAR } from "../../theme/style";
import { Icon } from "../icons/Icon";

const wrapperStyle = css(`
  position: relative;
  display: inline-flex;
  align-items: baseline;
  flex-direction: row;
  gap: ${VAR.SIZE.GAP.XS};
`);

const style = css(`
  display: inline-grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: stretch;
  justify-content: stretch;
  height: ${VAR.SIZE.BASE.M};
  width: ${VAR.SIZE.BASE.M};
  border-radius: ${VAR.RADIUS.DEFAULT};
  border: 1px solid currentColor;
  overflow: hidden;
  
  :focus-within {
    outline: 2px solid ${VAR.COLOR.BRAND.BACKGROUND};
    outline-offset: 2px;
  }
  
  & > * {
    grid-column: 1;
    grid-row: 1;
  }

  input[type=checkbox] {
    margin: 0;
    opacity: 0;
    width: 0;
    height: 0;
  }

  input[type=checkbox] + span {
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${VAR.COLOR.BRAND.COLOR};
    background: ${VAR.COLOR.BRAND.COLOR};
  }

  input[type=checkbox]:checked + span {
    color: ${VAR.COLOR.BRAND.COLOR};
    background: ${VAR.COLOR.BRAND.BACKGROUND};
  }
`);

type Props = {
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
  ...rest
}: Props &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "className" | "style" | "onChange"
  >) {
  const defaultId = useId();

  return (
    <label htmlFor={id ?? defaultId} className={wrapperStyle}>
      <span className={style}>
        <input
          {...rest}
          id={id ?? defaultId}
          type="checkbox"
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>
          <Icon name="check" />
        </span>
      </span>
      {/* @ts-ignore */}
      <span
        className={classNames(labelDefaultStyle)}
        style={{
          color: errors ? VAR.COLOR.NEGATIVE.COLOR : "inherit",
        }}
      >
        {label}
      </span>
      {errors && <ErrorMessage errors={errors} messages={messages} />}
    </label>
  );
}
