import React from 'react';
import { useModal } from 'src/hooks/useModal';
import { CategoryForm } from 'src/pages/category/form/category-form';
import { ButtonGhost } from 'src/shared/library/button/buttonGhost';
import { Translate } from 'src/shared/translate/translate';
import { ICONS } from 'src/shared/library/icon/icon';

export function AddCategoryModal() {
  const {Modal, setIsOpen} = useModal({
    title: 'category.add',
    content: (<CategoryForm
      onCancel={() => setIsOpen(false)}
      onSubmit={(data) => {
        setIsOpen(false);
      }}
    />),
    trigger: (
      <ButtonGhost iconRight={ICONS.ADD} onClick={() => {setIsOpen(true)}}>
          <Translate name="category.add" />
      </ButtonGhost>
    )
  });
  return <Modal />;
}