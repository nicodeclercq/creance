import React from 'react';
import { useModal } from 'src/hooks/useModal';
import { UserForm } from 'src/pages/user/form/user-form';
import { ButtonGhost } from 'src/shared/library/button/buttonGhost';
import { Translate } from 'src/shared/translate/translate';
import { ICONS } from 'src/shared/library/icon/icon';

export function AddUserModal() {
  const {Modal, setIsOpen} = useModal({
    title: 'user.add',
    content: (<UserForm
      onCancel={() => setIsOpen(false)}
      onSubmit={(data) => {
        setIsOpen(false);
      }}
    />),
    trigger: (
      <ButtonGhost iconRight={ICONS.ADD} onClick={() => {setIsOpen(true)}}>
          <Translate name="user.add" />
      </ButtonGhost>
    )
  });
  return <Modal />;
}