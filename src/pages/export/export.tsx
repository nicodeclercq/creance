import * as Either from "fp-ts/Either";

import { ButtonPrimary } from "../../shared/library/button/buttonPrimary";
import { FormLayout } from "../../components/formLayout/formLayout";
import { Icon } from "../../shared/library/icon/icon";
import { Stack } from "../../shared/layout/stack/stack";
import { Text } from "../../shared/library/text/text/text";
import { Translate } from "../../shared/translate/translate";
import { fold as foldUnion } from "../../utils/union-type-helper";
import { toCSV } from "../../services/CSVService";
import { toHTML } from "../../services/HTMLService";
import { useCalculation } from "../../hooks/useCalculation";
import { useCategoryState } from "../../hooks/useCategoryState";
import { useCreanceState } from "../../hooks/useCreanceState";
import { useExpenseState } from "../../hooks/useExpenseState";
import { useParams } from "react-router-dom";
import { useRoute } from "../../hooks/useRoute";
import { useSettings } from "../../hooks/useSettings";
import { useState } from "react";
import { useUserState } from "../../hooks/useUserState";

type ExportType = "csv" | "html";

const WAIT_TIME = 1000;

const eitherToPromise = <B, A>(c: Either.Either<B, A>): Promise<A> =>
  Either.fold(Promise.reject, (a: A) => Promise.resolve(a))(c);

const wait = (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

export function Export() {
  const { creanceId: routeId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { getAll: getUsers } = useUserState(routeId as string);
  const { categories } = useCategoryState(routeId as string);
  const { expenses } = useExpenseState(routeId as string);
  const { getUsersRepartition } = useCalculation(routeId as string);
  const { currentCreance } = useCreanceState(routeId as string);
  const [settings] = useSettings();
  const { back } = useRoute();
  const { currency } = settings;

  const onClick = (type: ExportType) => () => {
    const repartition = getUsersRepartition();
    const users = getUsers();

    const exportCreance = () =>
      Promise.all([
        eitherToPromise(Either.fromNullable(undefined)(currentCreance)),
        eitherToPromise(expenses),
        eitherToPromise(users),
        eitherToPromise(categories),
        eitherToPromise(repartition),
      ])
        .then(([c, expenses, users, categories, distribution]) =>
          Promise.resolve(distribution)
            .then((distribution) =>
              foldUnion({
                csv: () =>
                  toCSV({
                    distribution,
                    expenses,
                    users,
                    categories,
                    currency,
                  }),
                html: () =>
                  toHTML({
                    name: c.name,
                    distribution,
                    expenses,
                    users,
                    categories,
                    currency,
                  }),
              })(type)
            )
            .then((data) => ({ name: c.name, data }))
        )
        .then(() => {
          // return exportData(d.name, d.data, type)
        })
        .catch((e) => console.error(e));

    Promise.resolve()
      .then(() => setIsLoading(true))
      .then(() => Promise.all([exportCreance(), wait(WAIT_TIME)]))
      .then(() => {
        setIsLoading(false);
        back();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <FormLayout title="page.export">
      <Stack align="CENTER" justify="CENTER" spacing="L">
        <Icon name="ARCHIVE" size="XXL" />
        <Text>
          <Translate name="page.export.description" />
        </Text>
        {isLoading ? (
          <Text>
            <Translate name="export.loading" />
          </Text>
        ) : (
          <Stack align="CENTER" justify="CENTER" spacing="M">
            <ButtonPrimary iconLeft="NOTE" onClick={onClick("csv")}>
              CSV
            </ButtonPrimary>
            <ButtonPrimary iconLeft="NOTE" onClick={onClick("html")}>
              HTML
            </ButtonPrimary>
          </Stack>
        )}
      </Stack>
    </FormLayout>
  );
}
