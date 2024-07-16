import { useForm } from "react-hook-form";
import * as IO from "io-ts";
import { pipe } from "fp-ts/function";
import * as Either from "fp-ts/Either";
import * as Apply from "fp-ts/lib/Apply";
import { uid } from "../../../uid";
import * as Registerable from "../../../models/Registerable";
import { Label } from "../../../shared/library/text/label/label";
import { Form } from "../../../shared/library/form/form";
import { Category } from "../../../models/Category";
import { useCategoryState } from "../../../hooks/useCategoryState";
import { ICONS, IconName } from "../../../shared/library/icon/icon";
import { Translate } from "../../../shared/translate/translate";
import { getColor } from "../../../utils/color";
import { useParams } from "react-router-dom";

type Props = {
  onSubmit: (data: Category) => void;
  onCancel: () => void;
  isMain?: boolean;
  category?: Registerable.Registered<Category>;
};

const formDecoder = IO.type({
  name: IO.string,
  icon: IO.union(
    (Object.values(ICONS) as IconName[]).map((name) => IO.literal(name)) as [
      IO.LiteralC<IconName>,
      IO.LiteralC<IconName>,
      ...IO.LiteralC<IconName>[]
    ]
  ),
});

export function CategoryForm({
  category,
  onSubmit,
  onCancel,
  isMain = true,
}: Props) {
  const params = useParams();
  const creanceId = params.creanceId as string;
  const id = uid();
  const { add, of, update, count } = useCategoryState(creanceId);
  const { register, handleSubmit } = useForm();

  const submit = (data: unknown) => {
    pipe(
      {
        count: pipe(
          count(),
          Either.mapLeft((e) => new Error(e))
        ),
        data: pipe(
          data,
          formDecoder.decode,
          Either.mapLeft((e) => new Error(e.toLocaleString()))
        ),
      },
      Apply.sequenceS(Either.Applicative),
      Either.map(({ count, data }) => {
        const newCategory = of({
          id: category?.id,
          name: data.name,
          icon: data.icon,
          color: category?.color != null ? category.color : getColor(count),
        });

        if (category) {
          update(newCategory as Registerable.Registered<Category>);
        } else {
          add(newCategory as Registerable.Unregistered<Category>);
        }

        onSubmit(newCategory);
      })
    );
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
          {...register("icon")}
          defaultValue={category?.icon}
          id={`${id}-category-icon`}
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
          {...register("name")}
          required
          defaultValue={category?.name}
          id={`${id}-category-name`}
          type="text"
        />
      </div>
    </Form>
  );
}
