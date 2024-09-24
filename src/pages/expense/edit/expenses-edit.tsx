import * as Either from "fp-ts/Either";

import { Expense } from "../../../models/Expense";
import { ExpenseForm } from "../form/expenses-form";
import { FormLayout } from "../../../components/formLayout/formLayout";
import { Page404 } from "../../../pages/404";
import { ROUTES } from "../../../routes";
import { Registered } from "../../../models/Registerable";
import { pipe } from "fp-ts/function";
import { useExpenseState } from "../../../hooks/useExpenseState";
import { useParams } from "react-router-dom";
import { useRoute } from "../../../hooks/useRoute";

export function EditExpense() {
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { back, goTo } = useRoute();
  const { expenses } = useExpenseState(creanceId);

  const onSubmit = () => {
    goTo(ROUTES.EXPENSE_LIST, params as { [key: string]: string });
  };

  return pipe(
    params.id,
    Either.fromNullable("No id provided"),
    Either.chain((id) =>
      pipe(
        expenses,
        Either.chain((expenses) =>
          pipe(
            expenses.find((expense) => expense.id === id),
            Either.fromNullable("Expense not found")
          )
        )
      )
    ),
    Either.fold(
      () => <Page404 />,
      (e: Registered<Expense>) => (
        <FormLayout title="page.expenses.update">
          <ExpenseForm onSubmit={onSubmit} onCancel={back} expense={e} />
        </FormLayout>
      )
    )
  );
}
