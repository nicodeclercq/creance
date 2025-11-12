import {
  getExpenseAmountByCategory,
  getTotalExpenseAmount,
} from "../../../service/calculation";

import { Card } from "../../../ui/Card/Card";
import type { Category } from "../../../models/Category";
import { Either } from "../../../ui/Either";
import type { Expense } from "../../../models/Expense";
import { Paragraph } from "../../../ui/Paragraph/Paragraph";
import { PieChart } from "../../../ui/Pie/PieChart";
import { Price } from "../../../ui/Price/Price";
import { Stack } from "../../../ui/Stack/Stack";
import { Trans } from "react-i18next";
import { centToDecimal } from "../../../helpers/Number";
import { computeRandomColor } from "../../../ui/Avatar/Avatar";

type TotalAmountProps = {
  expenses: Expense[];
  categories: Record<string, Category>;
};

export function TotalAmount({ expenses, categories }: TotalAmountProps) {
  return (
    <Card>
      <Stack alignItems="center" gap="s">
        <Either
          data={getTotalExpenseAmount(expenses)}
          onLeft={() => <Price type="total">0</Price>}
          onRight={(totalAmount) => (
            <Paragraph styles={{ font: "body-large" }}>
              <Trans
                i18nKey="page.event.total"
                values={{ value: totalAmount }}
                components={{
                  Price: (
                    <Price as="span" styles={{ fontSize: "larger" }}>
                      {totalAmount}
                    </Price>
                  ),
                }}
              />
            </Paragraph>
          )}
        />
        <Either
          data={getExpenseAmountByCategory(expenses)}
          onLeft={() => <></>}
          onRight={(amountByCategory) => (
            <PieChart
              data={Object.entries(amountByCategory).map(([key, value]) => ({
                id: key,
                label: categories[key].name,
                value: centToDecimal(value),
                color: computeRandomColor(categories[key].icon),
              }))}
            />
          )}
        />
      </Stack>
    </Card>
  );
}
