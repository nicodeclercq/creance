import { useState } from "react";

import { uuid } from "../../../../utils/uuid";
import { Icon } from "../../icon/icon";
import "./toggle.css";

type Props = {
  id?: string;
  disabled?: boolean;
  checked?: boolean;
  onChange: (value: boolean) => void;
};
export function Toggle({
  id,
  disabled = false,
  checked = false,
  onChange,
}: Props) {
  const [_id] = useState(id || uuid());
  const [currentValue, setCurrentValue] = useState(checked);
  const onValueChange = (v: boolean) => {
    setCurrentValue(v);
    onChange(v);
  };

  return (
    <label htmlFor={_id} className="s-toggle">
      <input
        type="checkbox"
        id={_id}
        disabled={disabled}
        defaultChecked={currentValue}
        onClick={() => onValueChange(!currentValue)}
      />
      <div className="s-toggle__slide"></div>
      <div className="s-toggle__thumb">
        {currentValue ? <Icon name="CHECK" /> : <></>}
      </div>
    </label>
  );
}
