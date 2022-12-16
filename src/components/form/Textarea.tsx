import React, { TextareaHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';
import { ErrorMessage } from './ErrorMessage';

type Props= {
  theme: 'base' | 'neutral';
  errors?: FieldError;
  messages?: Record<string, string>;
  onChange: (value: string) => void;
}

export function Textarea ({onChange, theme, errors, disabled, messages, ...rest}: Props & Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className' | 'style' | 'onChange'
>) {

  return (
    <div className="inline-flex flex-col w-full">
      <textarea
        {...rest}
        disabled={disabled}
        className={`w-full max-w-full focus:ring-4`
        }
        onChange={e => {
          onChange(e.target.value);
        }}
        style={{minHeight: '10rem'}}
      />
      {errors && <ErrorMessage errors={errors} messages={messages} />}
    </div>
  );
};