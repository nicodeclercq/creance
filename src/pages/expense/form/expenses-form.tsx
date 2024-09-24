import { Registered, Unregistered } from "../../../models/Registerable";

import { Avatar } from "../../../shared/library/avatar/avatar";
import { ColumnFlexible } from "../../../shared/layout/columns/column-flexible";
import { ColumnRigid } from "../../../shared/layout/columns/column-rigid";
import { Columns } from "../../../shared/layout/columns/columns";
import { Either } from "../../../components/Either";
import { Expense } from "../../../models/Expense";
import { Form } from "../../../shared/library/form/form";
import { Label } from "../../../shared/library/text/label/label";
import { Stack } from "../../../shared/layout/stack/stack";
import { Translate } from "../../../shared/translate/translate";
import { uid } from "../../../uid";
import { useCategoryState } from "../../../hooks/useCategoryState";
import { useExpenseState } from "../../../hooks/useExpenseState";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useUserState } from "../../../hooks/useUserState";

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
  const { categories } = useCategoryState(creanceId);
  const { of, add, update } = useExpenseState(creanceId);
  const { register, handleSubmit } = useForm();

  const users = getAll();

  // TODO: fix type
  const submit = (data: any) => {
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
      // TODO: fix type
      add(newExpense as unknown as Unregistered<Expense>);
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
            data={categories}
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
