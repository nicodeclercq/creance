import * as Either from "fp-ts/Either";

import { calculationAsNumber, centToDecimal } from "../../helpers/Number";

import { pipe } from "fp-ts/function";
import { useTranslation } from "react-i18next";

type PriceProps = {
  as?: "p" | "span";
  children: string | number;
  type?: "default" | "sum" | "total";
  styles?: { fontSize: "large" | "default" | "small" | "smaller" };
  props?: React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement>;
};

export function Price({
  as: As = "p",
  children,
  type = "default",
  styles = { fontSize: "default" },
}: PriceProps) {
  const { t } = useTranslation();
  const calculatedAmount =
    typeof children === "string"
      ? calculationAsNumber(children)
      : Either.right(children);

  const getTranslationKey = () => {
    switch (type) {
      case "default":
        return "component.price.value";
      case "sum":
        const isNegative =
          typeof children === "number"
            ? children < 0
            : children.startsWith("-");
        return `component.price.sum${isNegative ? ".negative" : ".positive"}`;
      case "total":
        return "component.price.total";
    }
  };

  const font = `var(--ui-semantic-font-price-${styles.fontSize})`;

  return (
    <As
      data-component="Price"
      style={{
        font,
        whiteSpace: "pre",
      }}
    >
      {pipe(
        calculatedAmount,
        Either.map((a) => centToDecimal(`${a}`)),
        Either.fold(
          () => <>-</>,
          (value) => (
            <>
              {t(getTranslationKey(), {
                value: value.startsWith("-") ? value.slice(1) : value,
              })}
            </>
          )
        )
      )}
    </As>
  );
}
