import { useForm } from "react-hook-form";

import { uid } from "../../../uid";
import { Label } from "../../../shared/library/text/label/label";
import { Form } from "../../../shared/library/form/form";
import { Category } from "../../../models/Category";
import { useCategoryState } from "../../../hooks/useCategoryState";
import { ICONS, IconName } from "../../../shared/library/icon/icon";
import { Translate } from "../../../shared/translate/translate";
import { getColor } from "../../../utils/color";
import { SHADE_COLORS } from "../../../entities/color";

type Props = {
  onSubmit: (data: Category) => void;
  onCancel: () => void;
  isMain?: boolean;
  category?: Registered<Category>;
};

export function CategoryForm({
  category,
  onSubmit,
  onCancel,
  isMain = true,
}: Props) {
  const id = uid();
  const { add, of, update, getAll } = useCategoryState();
  const { register, handleSubmit } = useForm();

  const submit = (data) => {
    const count = Math.abs(SHADE_COLORS.length - getAll().length);
    const newCategory = of({
      id: category?.id,
      name: data.name,
      icon: data.icon,
      color: category?.color != null ? category.color : getColor(count),
    });
    if (category) {
      update(newCategory);
    } else {
      add(newCategory);
    }
    onSubmit(category);
  };

  const icons: { label: string; value: IconName }[] = [
    {
      label: "CAMERA",
      value: ICONS.CAMERA,
    },
    {
      label: "CAR",
      value: ICONS.CAR,
    },
    {
      label: "CART",
      value: ICONS.CART,
    },
    {
      label: "DINNER",
      value: ICONS.DINNER,
    },
    {
      label: "FLAG",
      value: ICONS.FLAG,
    },
    {
      label: "HOME",
      value: ICONS.HOME,
    },
    {
      label: "RUNNING",
      value: ICONS.RUNNING,
    },
    {
      label: "PIG",
      value: ICONS.PIG,
    },
    {
      label: "WINE",
      value: ICONS.WINE,
    },
  ];

  return (
    <Form
      onSubmit={handleSubmit(submit)}
      onCancel={onCancel}
      submitLabel={
        category ? "category.form.submit.edit" : "category.form.submit.add"
      }
      isMain={isMain}
    >
      <div>
        <Label htmlFor={`${id}-category-avatar`}>
          <Translate name="category.form.icon" />
        </Label>
        <select
          name="icon"
          defaultValue={category?.icon}
          id={`${id}-category-icon`}
          ref={register}
        >
          {icons.map((icon) => (
            <option key={icon.label} value={icon.value}>
              {icon.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor={`${id}-category-name`}>
          <Translate name="category.form.name" />
        </Label>
        <input
          name="name"
          required
          defaultValue={category?.name}
          id={`${id}-category-name`}
          type="text"
          ref={register}
        />
      </div>
    </Form>
  );
}
