import {
  CATEGORY_ICONS,
  CategoryIconName,
} from "../../../ui/CategoryIcon/private";
import { Category, DEFAULT_CATEGORY_ICON } from "../../../models/Category";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { CategoryIcon } from "../../../ui/CategoryIcon/CategoryIcon";
import { Form } from "../../../ui/Form/Form";
import { Fragment } from "react/jsx-runtime";
import { Grid } from "../../../ui/Grid/Grid";
import { IconButton } from "../../../ui/IconButton/IconButton";
import { InputText } from "../../../ui/FormField/InputText/InputText";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Select } from "../../../ui/FormField/Select/Select";
import styles from "./AddEventStep2.module.css";
import { uid } from "../../../service/crypto";
import { useTranslation } from "react-i18next";

type AddCategoryFormProps = {
  categories: Category[];
  onAdd: (category: Category) => void;
};

function AddCategoryForm({ onAdd, categories }: AddCategoryFormProps) {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<Omit<Category, "id">>({
    defaultValues: {
      name: "",
      icon: DEFAULT_CATEGORY_ICON,
    },
  });

  const addCategory = (data: Omit<Category, "_id">) => {
    const newCategory = {
      _id: uid(),
      ...data,
    };
    onAdd(newCategory);
    reset();
  };

  return (
    <div className={styles.addCategoryForm}>
      <Controller
        control={control}
        name="icon"
        render={({ field: { value, onChange } }) => (
          <Select
            variant="grid"
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
                (category) => category.name === value
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
      <div>
        <div style={{ font: "var(--ui-semantic-font-body-small)" }}>&nbsp;</div>
        <IconButton
          icon="add"
          label={t("page.events.add.form.category.submit")}
          onClick={handleSubmit(addCategory)}
          variant="tertiary"
        />
      </div>
    </div>
  );
}

export type CategoriesForm = {
  defaultCategories: Category[];
  cancel?: {
    onClick: (data: Category[]) => void;
    label: string;
  };
  submit: {
    onClick: (data: Category[]) => void;
    label: string;
  };
};

export function CategoriesForm({
  defaultCategories,
  submit,
  cancel,
}: CategoriesForm) {
  const { t } = useTranslation();
  const { control, watch, handleSubmit, formState, getValues } = useForm<{
    categories: Category[];
  }>({
    defaultValues: {
      categories: defaultCategories,
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "categories",
  });

  const removeCategory = (id: string) => () => {
    const index = fields.findIndex((item) => item._id === id);
    remove(index);
  };
  const hasError = Object.keys(formState.errors).length > 0;
  return (
    <Form
      hasError={hasError}
      handleSubmit={handleSubmit}
      submit={{
        label: submit.label,
        onClick: ({ categories }) => submit.onClick(categories),
      }}
      cancel={
        cancel
          ? {
              label: cancel.label,
              onClick: () => cancel.onClick(getValues("categories")),
            }
          : undefined
      }
    >
      <Grid
        columns={["min-content", "1fr", "min-content"]}
        gap="s"
        align="center"
        justify="start"
      >
        {fields.map((item, index) => (
          <Fragment key={item._id}>
            <CategoryIcon name={item.icon} size="m" label={item.name} />
            <Paragraph styles={{ flexGrow: true }}>{item.name}</Paragraph>
            {index === 0 ? (
              <span></span>
            ) : (
              <IconButton
                variant="tertiary"
                icon="trash"
                label={t("page.events.add.form.category.remove", {
                  name: item.name,
                })}
                onClick={removeCategory(item._id)}
              />
            )}
          </Fragment>
        ))}
        <AddCategoryForm
          onAdd={(category: Category) => append(category)}
          categories={watch("categories")}
        />
      </Grid>
    </Form>
  );
}
