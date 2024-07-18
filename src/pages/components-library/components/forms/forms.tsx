import { useState } from "react";

import { ComponentPreview } from "../../components-preview/components-preview";
import { InputText } from "../../../../shared/library/form/input-text/input-text";
import { Toggle } from "../../../../shared/library/form/toggle/toggle";
import { InputRadio } from "../../../../shared/library/form/input-radio/input-radio";
import { FieldRadio } from "../../../../shared/library/form/field-radio/field-radio";

export function Forms() {
  const log = (str: string) => () => console.log(str);

  const [currentRadio, setCurrentRadio] = useState("Hello");
  const [currentFieldRadio, setCurrentFieldRadio] = useState("Hello");

  return (
    <>
      <h3>Form</h3>
      <ComponentPreview label="InputText">
        <InputText label="Text" value="Hello World" onChange={log("change")} />
        <InputText
          label="Text"
          disabled
          value="Hello World"
          onChange={log("change")}
        />
      </ComponentPreview>
      <ComponentPreview label="Toggle">
        <Toggle checked={true} onChange={log("change")} />
        <Toggle checked={false} onChange={log("change")} />
        <Toggle disabled checked={true} onChange={log("change")} />
        <Toggle disabled checked={false} onChange={log("change")} />
      </ComponentPreview>
      <ComponentPreview label="InputRadio">
        <InputRadio
          value="Hello"
          name="radio1"
          checked={currentRadio === "Hello"}
          onChange={setCurrentRadio}
        />
        <InputRadio
          value="World"
          name="radio1"
          checked={currentRadio === "World"}
          onChange={setCurrentRadio}
        />
        <InputRadio
          value="___"
          name="radio1"
          disabled
          checked={currentRadio === "___"}
          onChange={setCurrentRadio}
        />
      </ComponentPreview>
      <ComponentPreview label="FieldRadio">
        <FieldRadio
          value="Hello"
          name="radio2"
          checked={currentFieldRadio === "Hello"}
          onChange={setCurrentFieldRadio}
        >
          Hello
        </FieldRadio>
        <FieldRadio
          value="World"
          name="radio2"
          checked={currentFieldRadio === "World"}
          onChange={setCurrentFieldRadio}
        >
          World
        </FieldRadio>
        <FieldRadio
          value="___"
          name="radio2"
          disabled
          checked={currentFieldRadio === "___"}
          onChange={setCurrentFieldRadio}
        >
          PLOP
        </FieldRadio>
      </ComponentPreview>
    </>
  );
}
