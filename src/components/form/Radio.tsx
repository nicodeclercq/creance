import React, { InputHTMLAttributes, useId } from "react";
import classNames from "classnames";
import { FieldError } from "react-hook-form";
import { css } from "@emotion/css";
import { ErrorMessage } from "./ErrorMessage";
import { styles as labelDefaultStyle } from "./Label";
import { VAR, radius } from "../../theme/style";
import { Icon } from "../icons/Icon";

const wrapperStyle = css(`
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  flex-direction: row;
  gap: ${VAR.SIZE.GAP.XXS};
`);

const style = css(`
  flex:none;
  display: inline-grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  align-items: stretch;
  justify-content: stretch;
  height: 2rem;
  width: 2rem;
  ${radius("ROUND")}
  border: 1px solid currentColor;
  overflow: hidden;
  
  :focus-within {
    outline: 2px solid ${VAR.COLOR.ACCENT.MAIN.WEAK};
    outline-offset: 2px;
  }
  
  & > * {
    grid-column: 1;
    grid-row: 1;
  }

  input[type=radio] {
    margin: 0;
    opacity: 0;
    width: 0;
    height: 0;
  }

  input[type=radio] + span {
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${VAR.COLOR.COMMON.SURFACE.BASE};
    background: ${VAR.COLOR.COMMON.SURFACE.BASE};
    font-size: 1.5rem;
  }

  input[type=radio]:checked + span {
    background: ${VAR.COLOR.ACCENT.MAIN.STRONG};
    color: ${VAR.COLOR.COMMON.SURFACE.BASE};
  }
`);
const labelStyleOverride = css`
  margin-top: 2px;
`;
const checkStyle = css`
  transform: scale(0);
  transform-origin: center;
  transition: transform 0.2s ease-in;

  input[type="radio"]:checked + & {
    transform: scale(1);
  }
`;

type Props = {
  label: string;
  onChange: (value: boolean) => void;
  errors?: FieldError;
  messages?: Record<string, string>;
};

export function Radio({
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
          type="radio"
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className={checkStyle}>
          <Icon name="check" />
        </span>
      </span>
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
