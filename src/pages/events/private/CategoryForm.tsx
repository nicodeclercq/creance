import {
  CATEGORY_ICONS,
  CategoryIconName,
} from "../../../ui/CategoryIcon/private";
import { Controller, useForm } from "react-hook-form";

import { Category } from "../../../models/Category";
import { CategoryIcon } from "../../../ui/CategoryIcon/CategoryIcon";
import { Form } from "../../../ui/Form/Form";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Select } from "../../../ui/FormField/Select/Select";
import { useTranslation } from "react-i18next";

type CategoryFormProps = {
  data: Category;
  onSubmit: (data: Category) => void;
  onCancel: () => void;
  categories: Category[];
  submitLabel: string;
  cancelLabel: string;
};

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
  } = useForm<Category>({
    defaultValues: data,
  });

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
        rules={{
          required: t(
            "page.events.add.form.field.categoryName.validation.required"
          ),
          validate: {
            isUnique: (value) => {
              const isUnique = !categories.some(
                (category) =>
                  category._id !== data._id && category.name === value
              );
              return (
                isUnique ||
                t("page.events.add.form.field.categoryName.validation.isUnique")
              );
            },
          },
        }}
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
