import { ComponentPreview } from "../components-preview/components-preview";
import { COLOR, toCssValue } from "../../../entities/color";

export function Colors() {
  return (
    <>
      <h2>Colors</h2>
      {Object.values(COLOR).map((color) => (
        <ComponentPreview key={color} label={color}>
          <div
            style={{
              width: "4rem",
              height: "4rem",
              background: toCssValue(color),
              border: "2px solid white",
              margin: "0.5rem",
              borderRadius: "50%",
              boxShadow: "0.125rem 0.125rem  0.25rem rgba(0,0,0,0.2)",
            }}
          ></div>
        </ComponentPreview>
      ))}
    </>
  );
}
