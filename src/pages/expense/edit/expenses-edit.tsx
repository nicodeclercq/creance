import { useParams } from "react-router-dom";
import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/function";

import { FormLayout } from "../../../components/formLayout/formLayout";
import { ExpenseForm } from "../form/expenses-form";
import { useRoute } from "../../../hooks/useRoute";
import { ROUTES } from "../../../routes";
import { useExpenseState } from "../../../hooks/useExpenseState";
import { Registered } from "../../../models/Registerable";
import { Expense } from "../../../models/Expense";
import { Page404 } from "../../../pages/404";

export function EditExpense() {
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { back, goTo } = useRoute();
  const { get } = useExpenseState(creanceId);

  const onSubmit = () => {
    goTo(ROUTES.EXPENSE_LIST, params);
  };

  return pipe(
    get(params.id),
    fold(
      () => <Page404 />,
      (e: Registered<Expense>) => (
        <FormLayout title="page.expenses.update">
          <ExpenseForm onSubmit={onSubmit} onCancel={back} expense={e} />
        </FormLayout>
      )
    )
  );
}
