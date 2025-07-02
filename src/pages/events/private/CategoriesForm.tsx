import { useFieldArray, useForm } from "react-hook-form";

import { AddCategoryForm } from "./AddCategoryForm";
import { Button } from "../../../ui/Button/Button";
import { Category } from "../../../models/Category";
import { CategoryIcon } from "../../../ui/CategoryIcon/CategoryIcon";
import { FormLayout } from "../../../ui/Form/Form";
import { Fragment } from "react/jsx-runtime";
import { Grid } from "../../../ui/Grid/Grid";
import { IconButton } from "../../../ui/IconButton/IconButton";
import { Modal } from "../../../ui/Modal/Modal";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { t } = useTranslation();
  const { control, watch, formState, getValues } = useForm<{
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
  const categories = watch("categories");

  return (
    <FormLayout
      hasError={hasError}
      isLoading={formState.isSubmitting}
      submit={{
        label: submit.label,
        onClick: () => submit.onClick(categories),
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
        <span></span>
        <Button
          icon={{ name: "add", position: "start" }}
          variant="tertiary"
          onClick={() => setIsFormOpen(true)}
          label={t("page.events.add.form.category.add")}
        />
      </Grid>
      <Modal title={t("page.events.add.form.category.add")} isOpen={isFormOpen}>
        <AddCategoryForm
          onAdd={(category: Category) => {
            append(category);
            setIsFormOpen(false);
          }}
          categories={categories}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>
    </FormLayout>
  );
}
