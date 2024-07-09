import { Card } from "../../../../shared/library/card/card";
import { SubTitle } from "../../../../shared/library/text/sub-title/sub-title";
import { Inline } from "../../../../shared/layout/inline/inline";
import { ColumnRigid } from "../../../../shared/layout/columns/column-rigid";
import { Icon } from "../../../../shared/library/icon/icon";
import { ColumnFlexible } from "../../../../shared/layout/columns/column-flexible";
import { Translate } from "../../../../shared/translate/translate";
import { Container } from "../../../../shared/layout/container/container";
import { Currency } from "../../../../components/currency/currency";
import { useCalculation } from "../../../../hooks/useCalculation";
import { useParams } from "react-router-dom";

export function TotalCount() {
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { getTotalExpense } = useCalculation(creanceId);

  const total = getTotalExpense();

  return (
    <Card>
      <SubTitle>
        <Inline spacingX="M" align="CENTER">
          <ColumnRigid>
            <Icon name="PIG" />
          </ColumnRigid>
          <ColumnFlexible>
            <Translate
              name="calculation.total.expenses"
              parameters={{
                total: (
                  <Container isFlex isInline foreground="ACCENT_DARK">
                    <Currency value={total} />
                  </Container>
                ),
              }}
            />
          </ColumnFlexible>
        </Inline>
      </SubTitle>
    </Card>
  );
}
