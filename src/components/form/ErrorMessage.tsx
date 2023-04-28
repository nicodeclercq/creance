import React from "react";
import { css } from "@emotion/css";
import { FieldError } from "react-hook-form";
import * as Record from "fp-ts/Record";
import { VAR } from "../../theme/style";
import { font } from "../../infrastructure/style";
import { Icon } from "../icons/Icon";

type Props = {
  errors: FieldError;
  messages?: Record<string, string>;
};

const defaultMessages = {
  required: "Ce champs est obligatoire",
  min: "La valeur est trop basse",
  max: "La valeur est trop haute",
};

const styles = css({
  ...VAR.FONT.TEXT.S,
  color: VAR.COLOR.NEGATIVE.MAIN.BASE,
  padding: `${VAR.SIZE.PADDING.VERTICAL.S} 0`,
});

export function ErrorMessage({ errors, messages = {} }: Props) {
  const displayesMessages = Record.toEntries({
    ...defaultMessages,
    ...messages,
  })
    .map(([key, value]) =>
      errors.type === key ? (
        <span key={`error_${key}`} className={styles}>
          <Icon name="alert" /> {value}
        </span>
      ) : undefined
    )
    .filter((value) => value != null);

  return <>{displayesMessages}</>;
}
