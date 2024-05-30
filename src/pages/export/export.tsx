import { useState } from "react";
import { useParams } from "react-router-dom";
import { Either, fold } from "fp-ts/es6/Either";

import { fold as foldUnion } from "../../utils/union-type-helper";
import { FormLayout } from "../../components/formLayout/formLayout";
import { Stack } from "../../shared/layout/stack/stack";
import { Icon } from "../../shared/library/icon/icon";
import { ButtonPrimary } from "../../shared/library/button/buttonPrimary";
import { Text } from "../../shared/library/text/text/text";
import { Translate } from "../../shared/translate/translate";
import { useExpenseState } from "../../hooks/useExpenseState";
import { useCalculation } from "../../hooks/useCalculation";
import { useCreanceState } from "../../hooks/useCreanceState";
import { CreditDistribution } from "../../services/CalculationService";
import { useUserState } from "../../hooks/useUserState";
import { useCategoryState } from "../../hooks/useCategoryState";
import { toCSV } from "../../services/CSVService";
import { useSettings } from "../../hooks/useSettings";
import { useRoute } from "../../hooks/useRoute";
import { toHTML } from "../../services/HTMLService";

type ExportType = "csv" | "html";

const WAIT_TIME = 1000;

const eitherToPromise = <B, A>(c: Either<B, A>): Promise<A> =>
  fold(
    (e: B) => Promise.reject(e),
    (a: A) => Promise.resolve(a)
  )(c);

const wait = (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

export function Export() {
  const [isLoading, setIsLoading] = useState(false);
  const { getAll: getUsers } = useUserState();
  const { getAll: getCategories } = useCategoryState();
  const { getAll } = useExpenseState();
  const { getUsersRepartition } = useCalculation();
  const { get } = useCreanceState();
  const { creanceId: routeId } = useParams();
  const [settings] = useSettings();
  const { back } = useRoute();
  const { currency } = settings;

  const onClick = (type: ExportType) => () => {
    const creance = get(routeId ?? "");
    const expenses = getAll();
    const repartition = getUsersRepartition();
    const users = getUsers();
    const categories = getCategories();

    const exportCreance = () =>
      eitherToPromise(creance)
        .then((c) =>
          eitherToPromise(repartition)
            .then(
              (
                distribution: Pick<
                  CreditDistribution,
                  "distribution" | "user"
                >[]
              ) => Promise.resolve(distribution)
            )
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
