import { CategoriesForm } from "./CategoriesForm";
import type { Category } from "../../../models/Category";
import { useTranslation } from "react-i18next";

export type Step2Data = {
  categories: Category[];
};
type AddEventStep2Props = {
  data: Step2Data;
  onNext: (data: Step2Data) => void;
  onPrevious: (data: Step2Data) => void;
};

export function AddEventStep2({
  data,
  onNext,
  onPrevious,
}: AddEventStep2Props) {
  const { t } = useTranslation();

  return (
    <CategoriesForm
      defaultCategories={data.categories}
      submit={{
        label: t("page.events.add.form.submit"),
        onClick: (categories) => onNext({ categories }),
      }}
      cancel={{
        label: t("page.events.add.form.previous"),
        onClick: (categories) => onPrevious({ categories }),
      }}
    />
  );
}
