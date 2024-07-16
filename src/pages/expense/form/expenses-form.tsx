import { useForm } from "react-hook-form";
import { Either } from "../../../components/Either";
import { uid } from "../../../uid";
import { Label } from "../../../shared/library/text/label/label";
import { Translate } from "../../../shared/translate/translate";
import { Stack } from "../../../shared/layout/stack/stack";
import { useUserState } from "../../../hooks/useUserState";
import { Avatar } from "../../../shared/library/avatar/avatar";
import { Form } from "../../../shared/library/form/form";
import { Columns } from "../../../shared/layout/columns/columns";
import { ColumnRigid } from "../../../shared/layout/columns/column-rigid";
import { ColumnFlexible } from "../../../shared/layout/columns/column-flexible";
import { useCategoryState } from "../../../hooks/useCategoryState";
import { useExpenseState } from "../../../hooks/useExpenseState";
import { Expense } from "../../../models/Expense";
import { Registered } from "../../../models/Registerable";
import { useParams } from "react-router-dom";

type Props = {
  onSubmit: () => void;
  onCancel: () => void;
  expense?: Registered<Expense>;
};

export function ExpenseForm({ expense, onSubmit, onCancel }: Props) {
  const id = uid();
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { getAll } = useUserState(creanceId);
  const { getAll: getAllCategories } = useCategoryState(creanceId);
  const { of, add, update } = useExpenseState(creanceId);
  const { register, handleSubmit } = useForm();

  const users = getAll();

  const submit = (data) => {
    const newExpense = of({
      id: expense?.id,
      amount: data.amount,
      category: data.category,
      distribution: data.distribution,
      from: data.from,
      description: data.description,
    });
    if (expense) {
      update(newExpense);
    } else {
      add(newExpense);
    }
    onSubmit();
  };

  return (
    <Form
      onSubmit={handleSubmit(submit)}
      onCancel={onCancel}
      submitLabel={
        expense ? "expense.form.submit.update" : "expense.form.submit.add"
      }
    >
      <div>
        <Label htmlFor={`${id}-from`}>
          <Translate name="expense.form.from" />
        </Label>
        <select
          {...register("from")}
          id={`${id}-from`}
          defaultValue={expense?.from}
        >
          <Either
            onLeft={(e) => e}
            data={users}
            onRight={(users) =>
              users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))
            }
          />
        </select>
      </div>
      <div>
        <Label htmlFor={`${id}-amount`}>
          <Translate name="expense.form.amount" />
        </Label>
        <input
          defaultValue={expense?.amount || 0}
          id={`${id}-amount`}
          type="text"
          {...register("amount", {
            pattern: {
              value: /^[-()\d/*+. ]+$/i,
              message: "invalid format",
            },
          })}
        />
      </div>
      <div>
        <Label htmlFor={`${id}-category`}>
          <Translate name="expense.form.category" />
        </Label>
        <select
          {...register("category")}
          id={`${id}-category`}
          defaultValue={expense?.category}
        >
          <Either
            data={getAllCategories()}
            onLeft={(e) => e}
            onRight={(categories) =>
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            }
          />
        </select>
      </div>
      <div>
        <Label>
          <Translate name="expense.form.distribution" />
        </Label>
        <Stack spacing="M">
          <Either
            onLeft={(e) => e}
            data={users}
            onRight={(users) =>
              users.map((user) => (
                <Columns key={user.id} spacing="M">
                  <ColumnRigid>
                    <Label>
                      <Avatar
                        color={user.color}
                        image={user.avatar}
                        name={user.name}
                      />
                    </Label>
                  </ColumnRigid>
                  <ColumnFlexible>
                    <input
                      {...register(`distribution[${user.id}]`)}
                      defaultValue={
                        expense?.distribution[user.id] ??
                        user.defaultDistribution
                      }
                      id={`${id}-distribution-${user.id}`}
                      min={0}
                      type="number"
                    />
                  </ColumnFlexible>
                </Columns>
              ))
            }
          />
        </Stack>
      </div>
      <div>
        <Label htmlFor={`${id}-description`}>
          <Translate name="expense.form.description" />
        </Label>
        <textarea
          style={{ minWidth: "100%", maxWidth: "100%" }}
          defaultValue={expense?.description}
          id={`${id}-description`}
          {...register("description")}
        />
      </div>
    </Form>
  );
}
