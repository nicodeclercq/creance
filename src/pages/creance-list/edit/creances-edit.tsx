import * as Either from "fp-ts/Either";

import { ButtonGhost } from "../../../shared/library/button/buttonGhost";
import { ButtonPrimary } from "../../../shared/library/button/buttonPrimary";
import { Container } from "../../../shared/layout/container/container";
import { Creance } from "../../../models/State";
import { CreanceForm } from "../form/creances-form";
import { FormLayout } from "../../../components/formLayout/formLayout";
import { ICONS } from "../../../shared/library/icon/icon";
import { Page404 } from "../../../pages/404";
import { ROUTES } from "../../../routes";
import { Registered } from "../../../models/Registerable";
import { Stack } from "../../../shared/layout/stack/stack";
import { Text } from "../../../shared/library/text/text/text";
import { Translate } from "../../../shared/translate/translate";
import { pipe } from "fp-ts/function";
import { useCreanceState } from "../../../hooks/useCreanceState";
import { useParams } from "react-router-dom";
import { useRoute } from "../../../hooks/useRoute";

export function EditCreance() {
  const { creanceId } = useParams();
  const { back, goTo } = useRoute();
  const { currentCreance, isLocked, update } = useCreanceState(
    creanceId as string
  );

  const onSubmit = () => {
    pipe(
      creanceId,
      Either.fromNullable("Creance not found"),
      Either.map((creanceId) => goTo(ROUTES.EXPENSE_LIST, { creanceId }))
    );
  };

  const lock = (creance: Registered<Creance>) => {
    update({
      ...creance,
      endDate: new Date(),
    });
  };

  const unlock = (creance: Registered<Creance>) => {
    update({
      ...creance,
      endDate: undefined,
    });
  };

  return pipe(
    currentCreance,
    Either.fromNullable(undefined),
    Either.fold(
      () => <Page404 />,
      (creance: Registered<Creance>) => (
        <FormLayout title="page.creance.update">
          <CreanceForm onSubmit={onSubmit} onCancel={back} creance={creance} />
          <Container paddingY="XL">
            {isLocked(creance) ? (
              <>
                <Container paddingY="S">
                  <Text>
                    <Translate name="unlock.description" />
                  </Text>
                </Container>
                <Stack align="CENTER" justify="CENTER">
                  <ButtonGhost
                    iconLeft={ICONS.UNLOCK}
                    onClick={() => unlock(creance)}
                  >
                    <Translate name="unlock" />
                  </ButtonGhost>
                </Stack>
              </>
            ) : (
              <>
                <Container paddingY="S">
                  <Text>
                    <Translate name="lock.description" />
                  </Text>
                </Container>
                <Stack align="CENTER" justify="CENTER">
                  <ButtonPrimary
                    iconLeft={ICONS.LOCK}
                    onClick={() => lock(creance)}
                  >
                    <Translate name="lock" />
                  </ButtonPrimary>
                </Stack>
              </>
            )}
          </Container>
        </FormLayout>
      )
    )
  );
}
