import React from 'react';

import { ComponentPreview } from '../../components-preview/components-preview';
import { Card } from '../../../../shared/library/card/card';
import { Dropdown } from '../../../../shared/library/dropdown/dropdown';
import { Avatar } from '../../../../shared/library/avatar/avatar';
import { Translate } from '../../../../shared/translate/translate';

export function Others() {
  return (
    <>
      <h3>Others</h3>
      <ComponentPreview label="Avatar">
        <Avatar/>
        <Avatar image="https://s2.qwant.com/thumbr/700x0/7/a/3d924739998ba71b9e1181aa375b139838d4abf77520983293c55e296456ee/Luke-Skywalker-in-Star-Wars-Explosion.jpg?u=http%3A%2F%2Fscreenrant.com%2Fwp-content%2Fuploads%2F2017%2F01%2FLuke-Skywalker-in-Star-Wars-Explosion.jpg&q=0&b=1&p=0&a=1" name="42"/>
        <Avatar image="https://s2.qwant.com/thumbr/700x0/7/a/3d924739998ba71b9e1181aa375b139838d4abf77520983293c55e296456ee/Luke-Skywalker-in-Star-Wars-Explosion.jpg?u=http%3A%2F%2Fscreenrant.com%2Fwp-content%2Fuploads%2F2017%2F01%2FLuke-Skywalker-in-Star-Wars-Explosion.jpg&q=0&b=1&p=0&a=1"/>
        <Avatar name="42"/>
      </ComponentPreview>

      <ComponentPreview label="Card">
        <Card>Hello World</Card>
      </ComponentPreview>

      
      <ComponentPreview label="Dropdown">
          <Dropdown dropDownContent={{
            menu1: (<>Hello</>),
            menu2: (<>World</>),
            menu3: (<>!!!</>),
          }}>
            Hello World
          </Dropdown>
          <Dropdown position="right" dropDownContent={{
            menu1: (<>Hello</>),
            menu2: (<>World</>),
            menu3: (<>!!!</>),
          }}>
            Hello World
          </Dropdown>
      </ComponentPreview>
      <ComponentPreview label="Translate">
        <div>
          <Translate name="componentsLibrary.welcomeMessage" parameters={{userName: 'Luke Skywalker'}}/>
        </div>
        <div>
          <Translate lang="en" name="componentsLibrary.welcomeMessage" parameters={{userName: 'Luke Skywalker'}}/>
        </div>
      </ComponentPreview>
    </>
  )
}