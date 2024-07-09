import { ReactNode } from "react";
import * as Either from "fp-ts/Either";
import { pipe } from "fp-ts/function";

import { DefaultLayout } from "../../components/defaultLayout/defaultLayout";
import { Card } from "../../shared/library/card/card";
import { useUserState } from "../../hooks/useUserState";
import { Stack } from "../../shared/layout/stack/stack";
import { Avatar } from "../../shared/library/avatar/avatar";
import { useCalculation } from "../../hooks/useCalculation";
import { Text } from "../../shared/library/text/text/text";
import { Currency } from "../../components/currency/currency";
import { Translate } from "../../shared/translate/translate";
import { Container } from "../../shared/layout/container/container";
import { Credit } from "../../services/CalculationService";
import { Registered } from "../../models/Registerable";
import { User } from "../../models/User";
import { Icon, ICONS } from "../../shared/library/icon/icon";
import { LabelSmall } from "../../shared/library/text/label-small/label-small";
import { Inline } from "../../shared/layout/inline/inline";
import { SPACING } from "../../entities/spacing";
import { useParams } from "react-router-dom";

function UserCredits({ credits }: { credits: Credit[] }) {
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { get } = useUserState(creanceId);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "15ch auto",
        gridRowGap: SPACING.XS,
        justifyContent: "stretch",
        justifyItems: "start",
        paddingTop: SPACING.M,
      }}
    >
      {credits.length ? (
        credits.map((d) => (
          <>
            <Container
              foreground={d.amount > 0 ? "SUCCESS_DARK" : "ERROR_DARK"}
            >
              <Inline spacing="S">
                <Icon
                  name={d.amount > 0 ? ICONS.ARROW_LEFT : ICONS.ARROW_RIGHT}
                />
                <Stack justify="CENTER">
                  <LabelSmall>
                    <Translate
                      name={
                        d.amount > 0
                          ? "page.summary.gets"
                          : "page.summary.gives"
                      }
                    />
                  </LabelSmall>
                  <Currency value={Math.abs(d.amount)} />
                </Stack>
              </Inline>
            </Container>
            {pipe(
              d.user,
              get,
              Either.fold(
                () => <Avatar name="Deleted User" />,
                (usr: Registered<User>) => (
                  <Avatar
                    color={usr.color}
                    name={usr.name}
                    image={usr.avatar}
                  />
                )
              )
            )}
          </>
        ))
      ) : (
        <Container paddingX="XL">
          <Text>-</Text>
        </Container>
      )}
    </div>
  );
}

export function Results() {
  const { getAll } = useUserState();
  const { getUsersRepartition } = useCalculation();

  const users = getAll();
  const distributions = getUsersRepartition();

  return (
    <DefaultLayout title="page.summary.title">
      <Card>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(2rem, auto) minmax(min-content, max-content)",
            gridRowGap: SPACING.L,
            gridColumnGap: SPACING.S,
          }}
        >
          {pipe(
            distributions,
            Either.chain((distributions) =>
              pipe(
                users,
                Either.map((users) => ({ users, distributions } as const))
              )
            ),
            Either.fold(
              () => (<></>) as ReactNode,
              ({ users, distributions: dist }) =>
                users.map((user) => (
                  <>
                    <div
                      style={{
                        justifySelf: "start",
                      }}
                    >
                      <Avatar
                        color={user.color}
                        name={user.name}
                        image={user.avatar}
                        size="L"
                      />
                    </div>
                    <UserCredits
                      credits={
                        dist.find((d) => d.user === user.id)?.distribution || []
                      }
                    />
                  </>
                ))
            )
          )}
        </div>
      </Card>
    </DefaultLayout>
  );
}
