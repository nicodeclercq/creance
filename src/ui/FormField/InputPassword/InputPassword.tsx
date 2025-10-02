import { Input } from "react-aria-components";
import { type InputProps } from "../private/InputProps";
import { FormField } from "../FormField";
import styles from "./InputPassword.module.css";
import { useId, useState } from "react";
import { IconButton } from "../../IconButton/IconButton";
import { useTranslation } from "react-i18next";

export type InputPasswordProps = InputProps<"password", string>;

export function InputPassword({
  value,
  onChange,
  isRequired = false,
  isDisabled = false,
  ...props
}: InputPasswordProps) {
  const { t } = useTranslation();
  const id = useId();
  const [isShown, setIsShown] = useState(false);
  const type = isShown ? "text" : "password";

  return (
    <FormField
      data-component="InputPassword"
      id={id}
      {...props}
      isDisabled={isDisabled}
      isRequired={isRequired}
    >
      <div className={styles.input}>
        <Input
          id={id}
          type={type}
          value={value}
          aria-required={isRequired}
          disabled={isDisabled}
          onChange={(event) => {
            onChange(event.target.value);
          }}
        />
        <IconButton
          label={t("component.password.showHide")}
          icon={isShown ? "hide" : "show"}
          onClick={() => setIsShown((a) => !a)}
          variant="secondary"
        />
      </div>
    </FormField>
  );
}
