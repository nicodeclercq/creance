import { useParams } from "react-router-dom";
import { DefaultLayout } from "../../../components/defaultLayout/defaultLayout";
import { Stack } from "../../../shared/layout/stack/stack";
import { TotalCount } from "./components/totalCount";
import { List } from "./components/list";
import { Initialize } from "../../../pages/initialize/initialize";
import { useInitializationState } from "../../../hooks/useInitializationState";
import { Either } from "../../../components/Either";

export function ExpenseList() {
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { needInitialization } = useInitializationState(creanceId);

  return (
    <Either
      data={needInitialization()}
      onLeft={() => <Initialize id={creanceId} />}
      onRight={() => (
        <DefaultLayout title="page.expenses.title">
          <Stack spacing="M">
            <TotalCount />
            <List />
          </Stack>
        </DefaultLayout>
      )}
    />
  );
}
