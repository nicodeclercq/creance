import { useParams } from "react-router-dom";

import { FormLayout } from "../../../components/formLayout/formLayout";
import { ExpenseForm } from "../form/expenses-form";
import { useRoute } from "../../../hooks/useRoute";
import { ROUTES } from "../../../routes";

export function AddExpense() {
  const params = useParams();
  const { back, goTo } = useRoute();
  const onSubmit = () => {
    goTo(ROUTES.EXPENSE_LIST, params as { [key: string]: string });
  };

  return (
    <FormLayout title="page.expenses.add">
      <ExpenseForm onSubmit={onSubmit} onCancel={back} />
    </FormLayout>
  );
}
