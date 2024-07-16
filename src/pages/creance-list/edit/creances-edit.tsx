import { useParams } from "react-router-dom";
import * as Either from "fp-ts/Either";
import { pipe } from "fp-ts/function";

import { FormLayout } from "../../../components/formLayout/formLayout";
import { CreanceForm } from "../form/creances-form";
import { useRoute } from "../../../hooks/useRoute";
import { ROUTES } from "../../../routes";
import { Registered } from "../../../models/Registerable";
import { Page404 } from "../../../pages/404";
import { useCreanceState } from "../../../hooks/useCreanceState";
import { Creance } from "../../../models/State";
import { ButtonGhost } from "../../../shared/library/button/buttonGhost";
import { ICONS } from "../../../shared/library/icon/icon";
import { Translate } from "../../../shared/translate/translate";
import { ButtonPrimary } from "../../../shared/library/button/buttonPrimary";
import { Container } from "../../../shared/layout/container/container";
import { Text } from "../../../shared/library/text/text/text";
import { Stack } from "../../../shared/layout/stack/stack";

export function EditCreance() {
  const { creanceId } = useParams();
  const { back, goTo } = useRoute();
  const { get, isLocked, update } = useCreanceState(creanceId);

  const creance = pipe(
    creanceId,
    Either.fromNullable("Creance not found"),
    Either.chain(get)
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
    creance,
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
