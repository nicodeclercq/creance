import { Stack } from "../../../shared/layout/stack/stack";
import { Container } from "../../../shared/layout/container/container";
import { Icon } from "../../../shared/library/icon/icon";
import { sort } from "../../../utils/date";
import { Translate } from "../../../shared/translate/translate";
import { useCreanceState } from "../../../hooks/useCreanceState";
import { Card, CARD_PADDING } from "../../../shared/library/card/card";
import { ListItem } from "./listItem";
import { ROUTES } from "../../../routes";
import { useRoute } from "../../../hooks/useRoute";
import { ButtonGhost } from "../../../shared/library/button/buttonGhost";
import { Columns } from "../../../shared/layout/columns/columns";
import { Title } from "../../../shared/library/text/title/title";
import { ColumnRigid } from "../../../shared/layout/columns/column-rigid";
import { COLOR } from "../../../entities/color";
import { pipe } from "../../../utils/functions";
import { groupBy } from "../../../utils/array";
import { Line } from "../../../components/line";
import { Fragment } from "react/jsx-runtime";

export function List() {
  const { getAll } = useCreanceState();
  const creanceList = getAll();
  const { goTo } = useRoute();

  const listGroups = pipe(
    creanceList.sort((a, b) => sort(b.date, a.date)),
    groupBy((creance) => creance.endDate == null)
  );
  const activeCount = listGroups[0].length;

  return (
    <Card
      noPaddings
      header={
        <Container background="PRIMARY_LIGHT" padding={CARD_PADDING}>
          <Columns spacing="M" justify="SPACE_BETWEEN">
            <Title>
              <Translate
                name={
                  activeCount === 1
                    ? "page.creances.list.count.singular"
                    : "page.creances.list.count.plural"
                }
                parameters={{ count: creanceList.length, activeCount }}
              />
            </Title>
            <ColumnRigid contentFit>
              <ButtonGhost
                withBackground
                onClick={() => goTo(ROUTES.CREANCE_ADD)}
              >
                <Icon name="ADD" />
              </ButtonGhost>
            </ColumnRigid>
          </Columns>
        </Container>
      }
    >
      {listGroups.map((list, index) => (
        <Fragment key={index}>
          {index !== 0 && <Line />}
          {list.map((creance) => (
            <Container
              key={creance.id}
              background={creance.endDate ? COLOR.INACTIVE : undefined}
              paddingX={CARD_PADDING}
              paddingY="S"
            >
              <ListItem creance={creance} />
            </Container>
          ))}
        </Fragment>
      ))}
      {creanceList.length === 0 && (
        <Container foreground="GREY" padding={CARD_PADDING}>
          <Stack align="CENTER" justify="CENTER" spacing="M">
            <Icon name="PIG" size="XXL" />
            <Translate name="page.creances.list.empty" />
          </Stack>
        </Container>
      )}
    </Card>
  );
}
