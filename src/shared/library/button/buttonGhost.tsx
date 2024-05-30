import { ReactNode } from "react";
import { useCss } from "react-use";
import { BORDER_DEFINITION } from "../../../entities/border";
import { RADIUS } from "../../../entities/radius";
import { SPACING } from "../../../entities/spacing";
import { IconName } from "../icon/icon";
import { FONT } from "../../../entities/font";
import { Button } from "./_button";
import { toCssValue, COLOR } from "../../../entities/color";

type Props = {
  children: ReactNode;
  withBackground?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  onClick: () => void;
};
export function ButtonGhost({
  children,
  withBackground,
  iconLeft,
  iconRight,
  onClick,
}: Props) {
  const styles = useCss({
    font: FONT.DEFAULT,
    border: BORDER_DEFINITION.DEFAULT,
    borderRadius: RADIUS.light,
    background: withBackground ? COLOR.WHITE : "transparent",
    color: "currentColor",
    flex: "none",
    whiteSpace: "nowrap",
    padding: SPACING.S,
    transition: "background 0.2s ease-in-out",
    "&:hover, &:active": {
      cursor: "pointer",
      background: withBackground
        ? COLOR.GREY_LIGHT
        : toCssValue(COLOR.OVERLAY_LIGHT),
    },
  });

  return (
    <Button
      onClick={onClick}
      iconLeft={iconLeft}
      iconRight={iconRight}
      className={styles}
    >
      {children}
    </Button>
  );
}
