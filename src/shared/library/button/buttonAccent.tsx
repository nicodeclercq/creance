import { ReactNode } from "react";
import { useCss } from "react-use";
import { BORDER_DEFINITION } from "../../../entities/border";
import { RADIUS } from "../../../entities/radius";
import { toCssValue } from "../../../entities/color";
import { SPACING } from "../../../entities/spacing";
import { SHADOW } from "../../../entities/shadow";
import { IconName } from "../icon/icon";
import { TRANSITION } from "../../../entities/transition";
import { FONT } from "../../../entities/font";
import { Button } from "./_button";

type Props = {
  children: ReactNode;
  iconLeft?: IconName;
  iconRight?: IconName;
  onClick: () => void;
  isSubmit?: boolean;
};
export function ButtonAccent({
  isSubmit,
  children,
  iconLeft,
  iconRight,
  onClick,
}: Props) {
  const style = useCss({
    flex: "none",
    whiteSpace: "nowrap",
    font: FONT.DEFAULT,
    border: BORDER_DEFINITION.NONE,
    borderRadius: RADIUS.light,
    background: toCssValue("ACCENT"),
    color: toCssValue("WHITE"),
    padding: SPACING.S,
    boxShadow: SHADOW.XS,
    transition: TRANSITION.DEFAULT,
    "&:hover": {
      background: toCssValue("ACCENT_DARK"),
      boxShadow: SHADOW.M,
      cursor: "pointer",
    },
  });

  return (
    <Button
      isSubmit={isSubmit}
      onClick={onClick}
      iconLeft={iconLeft}
      iconRight={iconRight}
      className={style}
    >
      {children}
    </Button>
  );
}
