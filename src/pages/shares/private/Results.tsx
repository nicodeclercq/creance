import * as Either from "fp-ts/Either";

import { Either as EitherComponent, sequence } from "../../../ui/Either";

import { Card } from "../../../ui/Card/Card";
import { Columns } from "../../../ui/Columns/Columns";
import { Divider } from "../../../ui/Divider/Divider";
import { Grid } from "../../../ui/Grid/Grid";
import { Heading } from "../../../ui/Heading/Heading";
import { Icon } from "../../../ui/Icon/Icon";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { Price } from "../../../ui/Price/Price";
import { Stack } from "../../../ui/Stack/Stack";
import { calculationAsNumber } from "../../../helpers/Number";
import { pipe } from "fp-ts/function";
import { useTranslation } from "react-i18next";

type ResultsProps = {
  children: string | number;
  total: string | number;
  deposits: number;
};

export function Results({ children, total, deposits }: ResultsProps) {
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
      return expensesAmount + deposits - participation;
    })
  );

  return (
    <EitherComponent
      data={sequence({ expensesAmount, participation, difference })}
      onLeft={() => <>-</>}
      onRight={({ expensesAmount, participation, difference }) => (
        <Card styles={{ textAlign: "end" }}>
          <Stack gap="s">
            <Columns gap="m" align="center">
              <Heading
                level={2}
                styles={{
                  textAlign: "start",
                  font: "body-large",
                  flexGrow: true,
                }}
              >
                {t("component.priceEvolution.difference", {
                  difference: difference >= 0 ? "positive" : "negative",
                })}
              </Heading>
              <Columns
                gap="s"
                align="center"
                styles={{
                  width: "max-content",
                  color:
                    difference >= 0 ? "primary-default" : "failure-default",
                }}
              >
                <Icon name={difference >= 0 ? "plus" : "minus"} size="s" />
                <Price>{Math.abs(difference)}</Price>
              </Columns>
            </Columns>
            <Divider />
            <Grid columns={["1fr", "max-content"]} gap="s" align="center">
              <Paragraph styles={{ textAlign: "start" }}>
                {t("component.priceEvolution.total")}
              </Paragraph>
              <Price>{expensesAmount}</Price>
              <Paragraph styles={{ textAlign: "start" }}>
                {t("page.usershare.deposit")}
              </Paragraph>
              <Price type="sum">{deposits}</Price>
              <Paragraph styles={{ textAlign: "start" }}>
                {t("component.priceEvolution.participation")}
              </Paragraph>
              <Price type="sum">{-1 * participation}</Price>
            </Grid>
          </Stack>
        </Card>
      )}
    />
  );
}
