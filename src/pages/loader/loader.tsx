import { toCssValue, COLOR } from "../../../src/entities/color";
import { Icon, ICONS } from "../../../src/shared/library/icon/icon";
import { useCss } from "react-use";

export function Loader() {
  const style = useCss({
    width: "100vw",
    height: "100vh",
    background: toCssValue(COLOR.PRIMARY),
    color: toCssValue(COLOR.WHITE),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& > *": {
      animation: "loading 1s ease-in-out alternate infinite",
    },
  });
  return (
    <div className={style}>
      <Icon name={ICONS.PIG} size="XXL" />
    </div>
  );
}
