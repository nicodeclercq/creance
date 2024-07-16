import { DefaultLayout } from "../components/defaultLayout/defaultLayout";
import { Title } from "../shared/library/text/title/title";
import { SubTitle } from "../shared/library/text/sub-title/sub-title";
import { Stack } from "../shared/layout/stack/stack";
import { ButtonAccent } from "../shared/library/button/buttonAccent";
import { ICONS } from "../shared/library/icon/icon";
import { Card } from "../shared/library/card/card";
import { useRoute } from "../hooks/useRoute";
import { ROUTES } from "../routes";
import { Translate } from "../shared/translate/translate";
import { ButtonGhost } from "../shared/library/button/buttonGhost";

export function Page404() {
  const { goTo, back } = useRoute();

  return (
    <DefaultLayout title="page.404.title">
      <Card>
        <Stack spacing="XL" align="CENTER">
          <Title>
            <Translate name="page.404.title" />
          </Title>
          <SubTitle>
            <Translate name="page.404.subtitle" />
          </SubTitle>
          <ButtonGhost iconLeft={ICONS.CHEVRON_LEFT} onClick={back}>
            <Translate name="page.404.back" />
          </ButtonGhost>
          <ButtonAccent
            iconLeft={ICONS.HOME}
            onClick={() => goTo(ROUTES.EXPENSE_LIST)}
          >
            <Translate name="page.404.home" />
          </ButtonAccent>
        </Stack>
      </Card>
    </DefaultLayout>
  );
}
