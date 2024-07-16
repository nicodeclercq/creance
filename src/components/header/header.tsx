import { useParams } from "react-router-dom";

import { Container } from "../../shared/layout/container/container";
import { Icon, ICONS } from "../../shared/library/icon/icon";
import { ColumnRigid } from "../../shared/layout/columns/column-rigid";
import { Title } from "../../shared/library/text/title/title";
import { ColumnFlexible } from "../../shared/layout/columns/column-flexible";
import { Translation } from "../../@types/translations";
import { Translate } from "../../shared/translate/translate";
import { Dropdown } from "../../shared/library/dropdown/dropdown";
import { ROUTES } from "../../routes";
import { Link } from "../../shared/library/text/link/link";
import { Columns } from "../../shared/layout/columns/columns";
import { useCreanceState } from "../../hooks/useCreanceState";

type Props = {
  title: Translation;
};

function DropdownContent() {
  const params = useParams();

  return {
    user: (
      <Link to={ROUTES.USER_LIST} parameters={params}>
        <Translate name="page.user.list" />
      </Link>
    ),
    categories: (
      <Link to={ROUTES.CATEGORIES_LIST} parameters={params}>
        <Translate name="page.category.list" />
      </Link>
    ),
    /*export: (
      <Link to={ROUTES.EXPORT} parameters={params}>
        <Translate name="page.export" />
      </Link>
    ),*/
  };
}

export function Header({ title }: Props) {
  const params = useParams();
  const creanceId = params.creanceId as string;
  const { getState, isLocked } = useCreanceState(creanceId);
  const state = getState();

  return (
    <Container
      position="fixed"
      width="100%"
      top={0}
      left={0}
      padding="M"
      background="PRIMARY_DARK"
      foreground="WHITE"
      shadow="M"
      zIndex="header"
    >
      <Columns spacing="M" justify="SPACE_BETWEEN">
        <Link to={ROUTES.CREANCE_LIST} display="block">
          <Columns spacing="S">
            <ColumnRigid>
              <Icon name="PIG" size="L" />
            </ColumnRigid>
            <ColumnFlexible>
              <Title>
                <Translate name={title} />
              </Title>
            </ColumnFlexible>
          </Columns>
        </Link>
        {!isLocked(state) && (
          <ColumnRigid>
            <Dropdown
              position="right"
              dropDownContent={DropdownContent()}
              onClick={() => {}}
            >
              <Icon name={ICONS.HAMBURGER} />
            </Dropdown>
          </ColumnRigid>
        )}
      </Columns>
    </Container>
  );
}
