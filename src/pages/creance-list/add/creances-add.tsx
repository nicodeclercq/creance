import { FormLayout } from "../../../components/formLayout/formLayout";
import { CreanceForm } from "../form/creances-form";
import { useRoute } from "../../../hooks/useRoute";
import { ROUTES } from "../../../routes";

export function AddCreance() {
  const { back, goTo } = useRoute();
  const onSubmit = () => {
    goTo(ROUTES.CREANCE_LIST);
  };

  return (
    <FormLayout title="page.creance.add">
      <CreanceForm onSubmit={onSubmit} onCancel={back} />
    </FormLayout>
  );
}
