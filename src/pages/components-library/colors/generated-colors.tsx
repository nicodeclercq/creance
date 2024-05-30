import { useState } from "react";

import { ComponentPreview } from "../components-preview/components-preview";
import { Inline } from "../../../shared/layout/inline/inline";
import { generateColor } from "../../../utils/color";

export function GeneratedColors() {
  const [value, setValue] = useState([""]);

  return (
    <>
      <h2>Generated Colors</h2>
      <ComponentPreview label="Colors">
        <input
          type="text"
          onChange={(e) => setValue(value.concat([e.target.value]))}
        />
        <Inline>
          {value.map((v) => (
            <div
              style={{
                width: "2rem",
                height: "2rem",
                background: generateColor(v),
                border: "1px solid white",
              }}
            ></div>
          ))}
        </Inline>
      </ComponentPreview>
    </>
  );
}
