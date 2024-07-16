import { ReactNode } from "react";
import { Link, useMatch, useParams } from "react-router-dom";
import { Container } from "../../shared/layout/container/container";
import { Icon, ICONS } from "../../shared/library/icon/icon";
import { RouteName, getPath, ROUTES, getRouteDefinition } from "../../routes";
import { Columns } from "../../shared/layout/columns/columns";
import { toCssValue, COLOR } from "../../entities/color";
import { Text } from "../../shared/library/text/text/text";
import { Translate } from "../../shared/translate/translate";
import { Stack } from "../../shared/layout/stack/stack";

const styles = (isActive: boolean) => ({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  justifyContent: "center",
  textDecoration: "none",
  textAlign: "center",
  borderTop: `0.5rem solid ${
    isActive ? toCssValue(COLOR.PRIMARY_LIGHT) : toCssValue(COLOR.PRIMARY_DARK)
  }`,
  color: COLOR.WHITE,
});

type Props = {
  children: ReactNode;
  to: RouteName;
};

function PanelButton({ to, children }: Props) {
  const params = useParams();
  const path = getRouteDefinition(to);
  const match = useMatch(path);

  return (
    <Link to={getPath(to, params)} style={styles(match != null)}>
      <Container width="100%" height="100%" isFlex padding="M">
        <Stack isFull>{children}</Stack>
      </Container>
    </Link>
  );
}

export function Footer() {
  return (
    <Container
      position="fixed"
      bottom={0}
      left={0}
      width="100%"
      background="PRIMARY_DARK"
      foreground="WHITE"
      shadow="FOOTER"
      zIndex="header"
    >
      <Columns align="STRETCH">
        <PanelButton to={ROUTES.EXPENSE_LIST}>
          <Icon name={ICONS.CART} />
          <Text>
            <Translate name="menu.expenses" />
          </Text>
        </PanelButton>
        <PanelButton to={ROUTES.DISTRIBUTION}>
          <Icon name={ICONS.STATS} />
          <Text>
            <Translate name="menu.distribution" />
          </Text>
        </PanelButton>
        <PanelButton to={ROUTES.RESULTS}>
          <Icon name={ICONS.BILL} />
          <Text>
            <Translate name="menu.summary" />
          </Text>
        </PanelButton>
      </Columns>
    </Container>
  );
}
