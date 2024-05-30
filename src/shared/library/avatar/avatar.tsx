import { Text } from "../text/text/text";
import { Icon, IconName } from "../icon/icon";
import { Spacing, toCssValue as toCssSize } from "../../../entities/spacing";
import { toCssValue } from "../../../entities/color";
import { INNER_SHADOW } from "../../../entities/shadow";
import { generateColor } from "../../../utils/color";
import { Inline } from "../../../shared/layout/inline/inline";
import { useCss } from "react-use";

const SIZES = {
  S: { s: "L", f: "S", m: "XS" },
  M: { s: "XL", f: "M", m: "S" },
  L: { s: "XXL", f: "L", m: "M" },
} as const;

type Props = {
  image?: string;
  icon?: IconName;
  name?: string;
  size?: keyof typeof SIZES;
  color?: string;
  hideName?: boolean;
};
export function Avatar({
  hideName,
  image,
  name,
  color,
  icon = "USER",
  size = "M",
}: Props) {
  const style = useCss({
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: toCssSize(SIZES[size].m),
    boxShadow:
      SIZES[size].s === "L" ? INNER_SHADOW.INNER_S : INNER_SHADOW.INNER_XS,
    borderRadius: "50%",
    border: "2px solid",
    width: toCssSize(SIZES[size].s),
    height: toCssSize(SIZES[size].s),
    fontSize: toCssSize(SIZES[size].f),
    color: toCssValue("WHITE"),
    overflow: "hidden",
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor:
      (name && (color || generateColor(name))) || toCssValue("PRIMARY_DARK"),
    flex: "none",
  });

  const NoAvatar = () => {
    return (
      <div style={style}>
        <Icon name={icon} />
      </div>
    );
  };

  return (
    <Inline align="CENTER" justify="START" spacing="S">
      {image ? <div style={style} /> : <NoAvatar />}
      {!hideName && name && <Text>{name}</Text>}
    </Inline>
  );
}
