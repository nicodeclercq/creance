import { ComponentPreview } from "../components-preview/components-preview";
import { Icon, ICONS } from "../../../shared/library/icon/icon";

export function Icons() {
  return (
    <>
      <h2>Icons</h2>
      {Object.values(ICONS).map((ico) => (
        <ComponentPreview key={ico} label={ico}>
          <Icon name={ico}></Icon>
        </ComponentPreview>
      ))}
    </>
  );
}
