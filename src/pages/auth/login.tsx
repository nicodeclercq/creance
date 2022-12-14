import React from 'react';
import { Title } from '../../components/text/title';
import { Card } from '../../components/card';
import { Center } from '../../components/layout/center';
import { Fill } from '../../components/layout/fill';
import { VAR } from '../../theme/style';
import { Subtitle } from '../../components/text/subTitle';
import { AutoLayout } from '../../components/layout/autoLayout';
import { List } from '../../components/list';
import { Currency } from '../../components/text/currency';


const itemRenderer = (value: number) => <AutoLayout padding="L"><Currency>{value}</Currency></AutoLayout>;
const items = [1, 2, 3, 4, 5, 6];

export function Login(){
  return (
    <Fill background={VAR.COLOR.BRAND.BACKGROUND}>
      <Center>
        <Card width="auto" padding="L">
          <AutoLayout padding={{y: 'M'}}>
            <Title>Coucou</Title>
            <Subtitle>Le monde</Subtitle>
            <List items={items} itemRenderer={itemRenderer} noPadding negativeMarginSize="L" />
          </AutoLayout>
        </Card>
      </Center>
    </Fill>
  );
}