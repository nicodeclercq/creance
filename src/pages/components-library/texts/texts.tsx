import React from 'react';

import { ComponentPreview } from '../components-preview/components-preview';
import { Title } from '../../../shared/library/text/title/title';
import { SubTitle } from '../../../shared/library/text/sub-title/sub-title';
import { Label } from '../../../shared/library/text/label/label';
import { Text } from '../../../shared/library/text/text/text';

export function Texts() {
  return (
    <>
      <h2>Text</h2>
      <ComponentPreview label="Title">
        <Title>Hello World</Title>
      </ComponentPreview>
      <ComponentPreview label="Subtitle">
        <SubTitle>Hello World</SubTitle>
      </ComponentPreview>
      <ComponentPreview label="Label">
        <Label>Hello World</Label>
      </ComponentPreview>
      <ComponentPreview label="TextDefault">
        <Text>Hello World</Text>
      </ComponentPreview>
    </>
  )
}