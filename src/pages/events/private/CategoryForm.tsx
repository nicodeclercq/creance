import { CATEGORY_ICONS } from "../../../ui/CategoryIcon/private";
import type { Category } from "../../../models/Category";
import { CategoryIcon } from "../../../ui/CategoryIcon/CategoryIcon";
import type { CategoryIconName } from "../../../ui/CategoryIcon/private";
import { Controller } from "react-hook-form";
import { Form } from "../../../ui/Form/Form";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Select } from "../../../ui/FormField/Select/Select";
import { categorySchema } from "../../../models/Category";
import { useForm } from "../../../hooks/useForm";
import { useTranslation } from "react-i18next";
import { z } from "zod";

type CategoryFormProps = {
  data: Category;
  onSubmit: (data: Category) => void;
  onCancel: () => void;
  categories: Category[];
  submitLabel: string;
  cancelLabel: string;
};

const categoryFormSchema = z.object({
  _id: categorySchema.shape._id,
  name: categorySchema.shape.name,
  icon: categorySchema.shape.icon,
});

export function CategoryForm({
  submitLabel,
  cancelLabel,
  onSubmit,
  onCancel,
  data,
  categories,
}: CategoryFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm(
    categoryFormSchema.refine(
      (value) =>
        !categories.some(
          (category) =>
            category._id !== data._id && category.name === value.name
        ),
      t("page.events.add.form.field.categoryName.validation.isUnique")
    ),
    {
      defaultValues: data,
    }
  );

  const hasError = Object.keys(errors).length > 0;

  return (
    <Form
      hasError={hasError}
      handleSubmit={handleSubmit}
      submit={{
        label: submitLabel,
        onClick: (data) => onSubmit(data),
      }}
      cancel={{
        label: cancelLabel,
        onClick: onCancel,
      }}
    >
      <Controller
        control={control}
        name="icon"
        render={({ field: { value, onChange } }) => (
          <Select
            label={t("page.events.add.form.field.categoryIcon.label")}
            valueRenderer={({ value, label }) => (
              <CategoryIcon
                name={value as CategoryIconName}
                size="m"
                label={label}
              />
            )}
            options={Object.entries(CATEGORY_ICONS).map(([key, { name }]) => ({
              id: key,
              label: t(name),
              value: key,
            }))}
            value={value}
            onChange={onChange}
          />
        )}
      />
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <InputText
            type="text"
            value={value}
            onChange={onChange}
            label={t("page.events.add.form.field.categoryName.label")}
            isRequired
            error={error?.message}
          />
        )}
      />
    </Form>
  );
}
