import {
  getAmountByCategory,
  getTotalAmount,
} from "../../../service/calculation";

import { Card } from "../../../ui/Card/Card";
import { Category } from "../../../models/Category";
import { Either } from "../../../ui/Either";
import { Expense } from "../../../models/Expense";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { PieChart } from "../../../ui/Pie/PieChart";
import { Stack } from "../../../ui/Stack/Stack";
import { centToDecimal } from "../../../helpers/Number";
import { computeRandomColor } from "../../../ui/Avatar/Avatar";
import { useTranslation } from "react-i18next";

type TotalAmountProps = {
  expenses: Expense[];
  categories: Record<string, Category>;
};

export function TotalAmount({ expenses, categories }: TotalAmountProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <Stack alignItems="center" gap="s">
        <Either
          data={getTotalAmount(expenses)}
          onLeft={() => <Paragraph>-</Paragraph>}
          onRight={(totalAmount) => (
            <Paragraph styles={{ font: "body-large" }}>
              {t("page.event.total", { value: centToDecimal(totalAmount) })}
            </Paragraph>
          )}
        />
        <Either
          data={getAmountByCategory(expenses)}
          onLeft={() => <Paragraph>-</Paragraph>}
          onRight={(amountByCategory) => (
            <PieChart
              data={Object.entries(amountByCategory).map(([key, value]) => ({
                id: key,
                label: categories[key].name,
                value: centToDecimal(value),
                color: computeRandomColor(categories[key].icon),
              }))}
              valueFormatter={(value) => t("component.price.value", { value })}
            />
          )}
        />
      </Stack>
    </Card>
  );
}
