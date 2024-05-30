import { ReactNode, useState } from "react";

import {
  Props as InputRadioProps,
  InputRadio,
} from "../input-radio/input-radio";
import { Label } from "../../text/label/label";
import { uuid } from "../../../../utils/uuid";
import { classNames } from "../../../../utils/classnames";
import "./field-radio.css";

type Props<T> = {
  children: ReactNode;
} & InputRadioProps<T>;
export function FieldRadio<T>({ id, children, ...other }: Props<T>) {
  const [_id] = useState(id || uuid());
  const inputRadioProps = { ...other, id: _id };
  const { checked, disabled } = inputRadioProps;

  return (
    <label
      htmlFor={_id}
      className={classNames({
        "s-field-radio": true,
        "s-field-radio--checked": checked,
        "s-field-radio--disabled": disabled,
      })}
    >
      <div className="s-field-radio__input">
        <InputRadio {...inputRadioProps}></InputRadio>
      </div>
      <Label htmlFor={_id}>{children}</Label>
    </label>
  );
}
