import React, { ReactNode } from "react";

import { Stack } from "../../../shared/layout/stack/stack";
import { Inline } from "../../../shared/layout/inline/inline";
import { ColumnRigid } from "../../../shared/layout/columns/column-rigid";
import { ButtonGhost } from "../button/buttonGhost";
import { Translate } from "../../../shared/translate/translate";
import { ButtonPrimary } from "../button/buttonPrimary";
import { Translation } from "../../../@types/translations";
import { ButtonAccent } from "../button/buttonAccent";

type Props = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  children: ReactNode;
  submitLabel: Translation;
  isMain?: boolean;
};

export function Form({
  onSubmit,
  onCancel,
  submitLabel,
  children,
  isMain = true,
}: Props) {
  const Submit = isMain ? ButtonAccent : ButtonPrimary;

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onSubmit(event);
  };

  return (
    <form onSubmit={submit}>
      <Stack spacing="L">
        {children}

        <Inline spacing="M" justify="SPACE_BETWEEN">
          <ColumnRigid>
            <ButtonGhost iconLeft="CHEVRON_LEFT" onClick={onCancel}>
              <Translate name="cancel" />
            </ButtonGhost>
          </ColumnRigid>
          <ColumnRigid>
            <Submit iconRight="CHECK" isSubmit onClick={() => {}}>
              <Translate name={submitLabel} />
            </Submit>
          </ColumnRigid>
        </Inline>
      </Stack>
    </form>
  );
}
