import { DefaultLayout } from "../../../components/defaultLayout/defaultLayout";
import { Stack } from "../../../shared/layout/stack/stack";
import { TotalCount } from "./components/totalCount";
import { List } from "./components/list";
import { Initialize } from "../../../pages/initialize/initialize";
import { useInitializationState } from "../../../hooks/useInitializationState";

export function ExpenseList() {
  const { needInitialization } = useInitializationState();
  console.log(needInitialization());
  return needInitialization() ? (
    <Initialize />
  ) : (
    <DefaultLayout title="page.expenses.title">
      <Stack spacing="M">
        <TotalCount />
        <List />
      </Stack>
    </DefaultLayout>
  );
}
