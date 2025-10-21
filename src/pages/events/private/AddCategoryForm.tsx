import type { Category } from "../../../models/Category";
import { CategoryForm } from "./CategoryForm";
import { DEFAULT_CATEGORY_ICON } from "../../../models/Category";
import { uid } from "../../../service/crypto";
import { useTranslation } from "react-i18next";

type AddCategoryFormProps = {
  categories: Category[];
  onAdd: (category: Category) => void;
  onCancel: () => void;
};

export function AddCategoryForm({
  onAdd,
  onCancel,
  categories,
}: AddCategoryFormProps) {
  const { t } = useTranslation();

  return (
    <CategoryForm
      categories={categories}
      data={{
        _id: uid(),
        name: "",
        icon: DEFAULT_CATEGORY_ICON,
      }}
      submitLabel={t("page.events.add.form.category.submit")}
      cancelLabel={t("page.events.add.form.category.cancel")}
      onSubmit={onAdd}
      onCancel={onCancel}
    />
  );
}
