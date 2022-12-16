import React, { InputHTMLAttributes, useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { FieldError } from 'react-hook-form';
import { css } from '@emotion/css';
import { ErrorMessage } from './ErrorMessage';
import { Label } from './Label';

const wrapperStyle = css({
  display: 'inline-flex',
  flexDirection: 'row',
});

const style = css({

});

type Props= {
  label: string;
  onChange: (value: boolean) => void;
  errors?: FieldError;
  messages?: Record<string, string>;
}

export function Checkbox ({label, onChange, errors, messages, ...rest}: Props & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'style' | 'onChange'
>) {
  const id = useMemo(() => `checkbox_${uuid()}`, []);

  return (
    <div className={wrapperStyle}>
      <input
        id={id}
        {...rest}
        type="checkbox"
        className={style}
        onChange={e => onChange(e.target.checked)}
      />
      <Label htmlFor={id} asErrors={errors != null}>{label}</Label>
      {errors && <ErrorMessage errors={errors} messages={messages} />}
    </div>
  );
};