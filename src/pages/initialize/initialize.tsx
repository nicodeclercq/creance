import * as EitherFP from "fp-ts/Either";

import { Arrow } from "../../components/arrow";
import { ButtonGhost } from "../../shared/library/button/buttonGhost";
import { ButtonPrimary } from "../../shared/library/button/buttonPrimary";
import { List as CategoryList } from "../category/list/list";
import { ColumnRigid } from "../../shared/layout/columns/column-rigid";
import { Container } from "../../shared/layout/container/container";
import { DefaultLayout } from "../../components/defaultLayout/defaultLayout";
import { Either } from "../../components/Either";
import { Inline } from "../../shared/layout/inline/inline";
import { Label } from "../../shared/library/text/label/label";
import { ROUTES } from "../../routes";
import { Stack } from "../../shared/layout/stack/stack";
import { SubTitle } from "../../shared/library/text/sub-title/sub-title";
import { Translate } from "../../shared/translate/translate";
import { List as UserList } from "../user/list/list";
import { pipe } from "fp-ts/function";
import { useCategoryState } from "../../hooks/useCategoryState";
import { useInitializationState } from "../../hooks/useInitializationState";
import { useModal } from "../../hooks/useModal";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useUserState } from "../../hooks/useUserState";

export function Initialize({ id }: { id: string }) {
  const { goTo } = useRoute();
  const { initializationFold, getStepNb, getStepsCount, next, previous } =
    useInitializationState(id);
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { isEmpty: hasNoUsers } = useUserState(creanceId);
  const { isEmpty: hasNoCategories } = useCategoryState(creanceId);
  const step = getStepNb();
  const total = getStepsCount();
  const onClose = () => goTo(ROUTES.CREANCE_LIST);

  const { Modal, setIsOpen } = useModal(
    pipe(
      initializationFold({
        onCategoriesInit: () => ({
          title: <Translate name="init" parameters={{ step, total }} />,
          beforeClose: () => false,
          content: (
            <Container scroll>
              <Stack spacing="M">
                <SubTitle>
                  <Translate name="init.categories" />
                </SubTitle>
                <Label>
                  <Translate name="init.categories.description" />
                </Label>
                <CategoryList />
              </Stack>
            </Container>
          ),
          footer: (
            <Container margin="XXL">
              <Inline justify="END" spacing="M">
                <ColumnRigid>
                  <ButtonGhost onClick={previous}>
                    <Translate name="init.previous" />
                  </ButtonGhost>
                </ColumnRigid>
                <Either
                  data={hasNoCategories}
                  onLeft={() => <></>}
                  onRight={() => (
                    <ColumnRigid>
                      <ButtonPrimary onClick={next}>
                        <Translate name="init.next" />
                      </ButtonPrimary>
                    </ColumnRigid>
                  )}
                />
              </Inline>
            </Container>
          ),
          isFull: true,
        }),
        onUsersInit: () => ({
          title: <Translate name="init" parameters={{ step, total }} />,
          beforeClose: () => false,
          content: (
            <Container scroll>
              <Stack spacing="M">
                <SubTitle>
                  <Translate name="init.users" />
                </SubTitle>
                <Label>
                  <Translate name="init.users.description" />
                </Label>
                <Arrow style={{ alignSelf: "center" }} />
                <UserList />
              </Stack>
            </Container>
          ),
          footer: (
            <Container margin="XXL">
              <Inline justify="END" spacing="S">
                <ColumnRigid>
                  <ButtonGhost
                    onClick={() => {
                      setIsOpen(false);
                      onClose();
                    }}
                  >
                    <Translate name="init.cancel" />
                  </ButtonGhost>
                </ColumnRigid>
                {!hasNoUsers() && (
                  <ColumnRigid>
                    <ButtonPrimary onClick={next}>
                      <Translate name="init.next" />
                    </ButtonPrimary>
                  </ColumnRigid>
                )}
              </Inline>
            </Container>
          ),
          isFull: true,
        }),
      }),
      EitherFP.fold(
        (e) => ({
          content: <div>{e}</div>,
          title: <div>Unexpected Error</div>,
        }),
        (a) => a
      )
    )
  );

  return (
    <DefaultLayout title="page.expenses.title">
      <Modal />
    </DefaultLayout>
  );
}
