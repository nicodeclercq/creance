import { pipe } from "fp-ts/function";
import * as Either from "fp-ts/Either";
import { Either as EitherComponent } from "../../components/Either";
import { DefaultLayout } from "../../components/defaultLayout/defaultLayout";
import { Card, CARD_PADDING } from "../../shared/library/card/card";
import { useUserState } from "../../hooks/useUserState";
import { Stack } from "../../shared/layout/stack/stack";
import { Avatar } from "../../shared/library/avatar/avatar";
import { ColumnFlexible } from "../../shared/layout/columns/column-flexible";
import { ColumnRigid } from "../../shared/layout/columns/column-rigid";
import { Columns } from "../../shared/layout/columns/columns";
import { useCalculation } from "../../hooks/useCalculation";
import { Text } from "../../shared/library/text/text/text";
import { Currency } from "../../components/currency/currency";
import { Accordion } from "../../components/accordion";
import { Translate } from "../../shared/translate/translate";
import { Container } from "../../shared/layout/container/container";
import { UserDistribution } from "../../services/CalculationService";
import { useCategoryState } from "../../hooks/useCategoryState";
import { Category } from "../../models/Category";
import { Registered } from "../../models/Registerable";
import { LabelSmall } from "../../shared/library/text/label-small/label-small";
import { Label } from "../../shared/library/text/label/label";
import { SubTitle } from "../../shared/library/text/sub-title/sub-title";
import { useParams } from "react-router-dom";

export function Distribution() {
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { getAll } = useUserState(creanceId);
  const { getUsersCosts, getTotalExpense, getUsersExpense } =
    useCalculation(creanceId);
  const { get } = useCategoryState(creanceId);

  const usersCost = getUsersCosts();
  const usersExpense = getUsersExpense();
  const totalExpense = getTotalExpense();

  return (
    <DefaultLayout title="page.distribution.title">
      <Card
        header={
          <Container background="PRIMARY_LIGHT" padding={CARD_PADDING}>
            <SubTitle>
              <Columns>
                <ColumnFlexible>
                  <Translate name="page.distribution.total" />
                </ColumnFlexible>
                <ColumnRigid>
                  <Container isFlex isInline foreground="PRIMARY_DARK">
                    <span style={{ marginRight: "3rem" }}>
                      <EitherComponent
                        data={totalExpense}
                        onRight={(total) => <Currency value={total} />}
                        onLeft={(e) => e}
                      />
                    </span>
                  </Container>
                </ColumnRigid>
              </Columns>
            </SubTitle>
          </Container>
        }
      >
        <Container paddingY="M">
          <Stack spacing="M">
            <EitherComponent
              data={getAll()}
              onLeft={(e) => e}
              onRight={(data) =>
                data.map((user) => (
                  <Accordion
                    title={
                      <Columns spacing="M" justify="SPACE_BETWEEN" grow>
                        <ColumnFlexible>
                          <Columns spacing="S">
                            <Avatar
                              color={user.color}
                              name={user.name}
                              image={user.avatar}
                              size="L"
                              hideName
                            />
                            <ColumnFlexible>
                              <Label>{user.name}</Label>
                              &nbsp;
                              <LabelSmall>
                                <EitherComponent
                                  data={usersExpense}
                                  onLeft={(e) => e}
                                  onRight={(usersExpense) => (
                                    <Translate
                                      name="page.distribution.expense"
                                      parameters={{
                                        amount: (
                                          <Currency
                                            value={usersExpense[user.id]}
                                          />
                                        ),
                                      }}
                                    />
                                  )}
                                />
                              </LabelSmall>
                            </ColumnFlexible>
                          </Columns>
                        </ColumnFlexible>
                        <ColumnRigid>
                          <Stack align="END">
                            <EitherComponent
                              data={usersCost}
                              onLeft={(e) => e}
                              onRight={(usersCost) => (
                                <EitherComponent
                                  data={usersCost[user.id]}
                                  onLeft={(e) => e.message}
                                  onRight={(userCost) => (
                                    <Label color="GREY_DARK">
                                      <Translate
                                        name="page.distribution.credit"
                                        parameters={{
                                          amount: (
                                            <Currency value={userCost.total} />
                                          ),
                                        }}
                                      />
                                    </Label>
                                  )}
                                />
                              )}
                            />
                          </Stack>
                        </ColumnRigid>
                      </Columns>
                    }
                  >
                    <Container marginX="M">
                      <Stack spacing="M">
                        {pipe(
                          usersCost,
                          Either.mapLeft((e) => new Error(e)),
                          Either.chain((usersCost) =>
                            usersCost[user.id]
                              ? usersCost[user.id]
                              : Either.left(new Error("Unknown user"))
                          ),
                          Either.fold(
                            (e) => [<Text>{e.message}</Text>],
                            (value: UserDistribution) =>
                              value.distribution.map(
                                ({ amount, expense }, index) => (
                                  <Columns key={index} grow>
                                    <ColumnFlexible>
                                      <EitherComponent
                                        data={get(expense.category)}
                                        onLeft={() => <>-</>}
                                        onRight={(
                                          category: Registered<Category>
                                        ) => (
                                          <Avatar
                                            color={category.color}
                                            name={category.name}
                                            icon={category.icon}
                                          />
                                        )}
                                      />
                                    </ColumnFlexible>
                                    <ColumnRigid>
                                      <Container
                                        isFlex
                                        isInline
                                        foreground="GREY"
                                      >
                                        <span style={{ marginRight: "2rem" }}>
                                          <Currency value={amount} />
                                        </span>
                                      </Container>
                                    </ColumnRigid>
                                  </Columns>
                                )
                              )
                          )
                        )}
                      </Stack>
                    </Container>
                  </Accordion>
                ))
              }
            />
          </Stack>
        </Container>
      </Card>
    </DefaultLayout>
  );
}
