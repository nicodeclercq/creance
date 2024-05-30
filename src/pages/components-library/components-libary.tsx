import React from 'react';

import { Icons } from './icons/icons';
import { Colors } from './colors/colors';
import { Texts } from './texts/texts';
import { Components } from './components/components';
import { Templates } from './templates/templates';

import './components-library.css';
import { GeneratedColors } from './colors/generated-colors';

export function ComponentLibrary(){
  return (
    <div className="container" style={{fontFamily: 'sans-serif'}}>
      <Icons></Icons>
      <Colors></Colors>
      <GeneratedColors></GeneratedColors>
      <Texts></Texts>
      <Components></Components>
      <Templates></Templates>
    </div>
  );
};