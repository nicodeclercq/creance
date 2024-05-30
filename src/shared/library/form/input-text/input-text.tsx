import { ReactNode, useState } from "react";

import { Label } from "../../text/label/label";
import { uuid } from "../../../../utils/uuid";
import "./input-text.css";

type Props = {
  id?: string;
  disabled?: boolean;
  value: string;
  label: ReactNode;
  onChange: (value: string) => void;
};
export function InputText({ id, label, disabled, value, onChange }: Props) {
  const [_id] = useState(id || uuid());
  const [currentValue, setCurrentValue] = useState(value);
  const onValueChange = (v: string) => {
    setCurrentValue(v);
    onChange(v);
  };

  return (
    <span className="s-input-text">
      <input
        className="s-input-text__field"
        type="text"
        id={_id}
        disabled={disabled}
        value={currentValue}
        onChange={(e) => onValueChange(e.target.value)}
      />
      <label htmlFor={_id} className="s-input-text__label">
        <Label>{label}</Label>
      </label>
    </span>
  );
}
