import React from "react";
import { css } from "@emotion/css";
import { FieldError } from "react-hook-form";
import * as Record from "fp-ts/Record";
import { VAR } from "../../theme/style";
import { font } from "../../infrastructure/style";
import { FONTS } from "../../theme/theme";
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
  ...font(FONTS.TEXT.S),
  color: VAR.COLOR.NEGATIVE.COLOR,
  padding: `${VAR.SIZE.PADDING.S.VERTICAL} 0`,
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
