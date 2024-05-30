import { useState } from "react";

import { uuid } from "../../../../utils/uuid";
import { Icon } from "../../icon/icon";
import "./input-radio.css";

export type Props<T> = {
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  value: T;
  onChange: (value: T) => void;
};

export function InputRadio<T>({
  id,
  disabled = false,
  checked = false,
  onChange,
  name,
  value,
}: Props<T>) {
  const [_id] = useState(id || uuid());
  const onValueChange = (v: T) => {
    onChange(v);
  };

  return (
    <label htmlFor={_id} className="s-input-radio">
      <input
        type="radio"
        id={_id}
        disabled={disabled}
        name={name}
        value={_id}
        checked={checked}
        onChange={() => onValueChange(value)}
      />
      <div className="s-input-radio__thumb">
        <div className="s-input-radio__icon">
          <Icon name="CHECK"></Icon>
        </div>
      </div>
    </label>
  );
}
