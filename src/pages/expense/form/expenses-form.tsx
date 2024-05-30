import { useForm } from "react-hook-form";

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

type Props = {
  onSubmit: () => void;
  onCancel: () => void;
  expense?: Registered<Expense>;
};

export function ExpenseForm({ expense, onSubmit, onCancel }: Props) {
  const id = uid();
  const { getAll } = useUserState();
  const { getAll: getAllCategories } = useCategoryState();
  const { of, add, update } = useExpenseState();
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
          name="from"
          id={`${id}-from`}
          defaultValue={expense?.from}
          ref={register}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor={`${id}-amount`}>
          <Translate name="expense.form.amount" />
        </Label>
        <input
          name="amount"
          defaultValue={expense?.amount || 0}
          id={`${id}-amount`}
          type="text"
          ref={register({
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
          name="category"
          id={`${id}-category`}
          defaultValue={expense?.category}
          ref={register}
        >
          {getAllCategories().map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>
          <Translate name="expense.form.distribution" />
        </Label>
        <Stack spacing="M">
          {users.map((user) => (
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
                  name={`distribution[${user.id}]`}
                  defaultValue={
                    expense?.distribution[user.id] ?? user.defaultDistribution
                  }
                  id={`${id}-distribution-${user.id}`}
                  min={0}
                  type="number"
                  ref={register}
                />
              </ColumnFlexible>
            </Columns>
          ))}
        </Stack>
      </div>
      <div>
        <Label htmlFor={`${id}-description`}>
          <Translate name="expense.form.description" />
        </Label>
        <textarea
          style={{ minWidth: "100%", maxWidth: "100%" }}
          defaultValue={expense?.description}
          name="description"
          id={`${id}-description`}
          ref={register}
        />
      </div>
    </Form>
  );
}
