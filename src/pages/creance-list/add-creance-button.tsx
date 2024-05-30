import React from 'react';

import { useRoute } from 'src/hooks/useRoute';
import { ButtonAccent } from 'src/shared/library/button/buttonAccent';
import { Translate } from 'src/shared/translate/translate';
import { ICONS } from 'src/shared/library/icon/icon';
import { ROUTES } from 'src/routes';
import { Container } from 'src/shared/layout/container/container';
import { CARD_PADDING } from 'src/shared/library/card/card';

export function AddCreanceButton(){
  const { goTo } = useRoute();
  return (
    <Container background='PRIMARY_LIGHT' padding={CARD_PADDING} isFlex>
      <ButtonAccent iconRight={ICONS.ADD} onClick={() => goTo(ROUTES.CREANCE_ADD)}>
        <Translate name="page.creances.list.add" />
      </ButtonAccent>
    </Container>
  );
};