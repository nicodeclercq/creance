import * as Either from "fp-ts/Either";

import { Paragraph, ParagraphProps } from "../Paragraph/Paragraph";
import { calculationAsNumber, centToDecimal } from "../../helpers/Number";

import { pipe } from "fp-ts/function";
import { useTranslation } from "react-i18next";

type PriceProps = {
  children: string | number;
  type?: "default" | "sum" | "total";
  styles?: ParagraphProps["styles"];
};

export function Price({
  children,
  type = "default",
  styles = { font: "body-large" },
}: PriceProps) {
  const { t } = useTranslation();
  const calculatedAmount =
    typeof children === "string"
      ? calculationAsNumber(children)
      : Either.right(children);

  return (
    <Paragraph styles={styles}>
      {pipe(
        calculatedAmount,
        Either.map((a) => centToDecimal(`${a}`)),
        Either.fold(
          () => <>-</>,
          (value) => (
            <>
              {t(`component.price.${type === "default" ? "value" : type}`, {
                value,
              })}
            </>
          )
        )
      )}
    </Paragraph>
  );
}
