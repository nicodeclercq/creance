import * as Either from "fp-ts/Either";

import { Either as EitherComponent, sequence } from "../../../../ui/Either";

import { Columns } from "../../../../ui/Columns/Columns";
import { Event } from "../../../../models/Event";
import { Grid } from "../../../../ui/Grid/Grid";
import { Icon } from "../../../../ui/Icon/Icon";
import { Paragraph } from "../../../../ui/Paragraph/Paragraph";
import { Price } from "../../../../ui/Price/Price";
import { Stack } from "../../../../ui/Stack/Stack";
import { calculationAsNumber } from "../../../../helpers/Number";
import { pipe } from "fp-ts/function";
import { useTranslation } from "react-i18next";

type PriceEvolutionProps = {
  children: string | number;
  total: string | number;
};

export function PriceEvolution({ children, total }: PriceEvolutionProps) {
  const { t } = useTranslation();
  const expensesAmount =
    typeof children === "string"
      ? calculationAsNumber(children)
      : Either.right(children);
  const participation =
    typeof total === "string"
      ? calculationAsNumber(total)
      : Either.right(total);
  const difference = pipe(
    sequence({ expensesAmount, participation }),
    Either.map(({ expensesAmount, participation }) => {
      return expensesAmount - participation;
    })
  );

  return (
    <EitherComponent
      data={sequence({ expensesAmount, participation, difference })}
      onLeft={() => <>-</>}
      onRight={({ expensesAmount, participation, difference }) => (
        <Stack gap="s">
          <Grid columns={2} gap="s" align="center">
            <Paragraph styles={{ font: "body-large", textAlign: "start" }}>
              {t("component.priceEvolution.participation")}
            </Paragraph>
            <Price styles={{ font: "body-large" }} type="total">
              {participation}
            </Price>
            <Paragraph styles={{ font: "body-small", textAlign: "start" }}>
              {t("component.priceEvolution.total")}
            </Paragraph>
            <Price styles={{ font: "body-small" }}>{expensesAmount}</Price>
            <Paragraph
              styles={{
                font: "body-small",
                textAlign: "start",
                color: difference >= 0 ? "primary-default" : "failure-default",
              }}
            >
              {t("component.priceEvolution.difference", {
                difference: difference >= 0 ? "positive" : "negative",
              })}
            </Paragraph>
            <Columns
              align="center"
              justify="end"
              gap="s"
              styles={{
                color: difference >= 0 ? "primary-default" : "failure-default",
              }}
            >
              <Icon name={difference >= 0 ? "plus" : "minus"} size="s" />
              <Price styles={{ font: "body-small" }}>
                {Math.abs(difference)}
              </Price>
            </Columns>
          </Grid>
        </Stack>
      )}
    />
  );
}
