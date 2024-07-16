import { useModal } from "../../../hooks/useModal";
import { CategoryForm } from "../../../pages/category/form/category-form";
import { ButtonGhost } from "../../../shared/library/button/buttonGhost";
import { Translate } from "../../../shared/translate/translate";
import { ICONS } from "../../../shared/library/icon/icon";

export function AddCategoryModal() {
  const { Modal, setIsOpen } = useModal({
    title: "category.add",
    content: (
      <CategoryForm
        onCancel={() => setIsOpen(false)}
        onSubmit={() => {
          setIsOpen(false);
        }}
      />
    ),
    trigger: (
      <ButtonGhost
        iconRight={ICONS.ADD}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <Translate name="category.add" />
      </ButtonGhost>
    ),
  });
  return <Modal />;
}
