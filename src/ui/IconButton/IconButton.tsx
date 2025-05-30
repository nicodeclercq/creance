import classNames from "classnames";
import buttonStyles from "../Button/Button.module.css";
import styles from "./IconButton.module.css";
import { Icon, type IconProps } from "../Icon/Icon";
import { Link } from "react-router-dom";
import { getPath, RouteName } from "../../routes";
import { Button, Tooltip, TooltipTrigger } from "react-aria-components";

type CommonProps = {
  label: string;
  icon: IconProps["name"];
  variant?: "primary" | "secondary" | "tertiary";
  overlays?: boolean;
};

export type AsLink = {
  as: "link";
  to: RouteName;
  params?: Record<string, string | number>;
};

export type AsButton = {
  as?: "button";
  type?: "button";
  onClick?: () => void;
};

export type IconButtonProps<T extends AsLink | AsButton = AsLink | AsButton> =
  CommonProps & T;

function isLink(props: IconButtonProps): props is CommonProps & AsLink {
  return props.as === "link";
}

export function IconButton(props: IconButtonProps) {
  const {
    icon,
    label,
    variant = "primary",
    overlays = false,
    ...otherProps
  } = props;

  const commonProps = {
    ["aria-label"]: label,
    className: classNames(
      buttonStyles.button,
      styles.button,
      buttonStyles[`hasVariant-${variant}`],
      {
        [buttonStyles.isOverlay]: overlays,
      }
    ),
    children: <Icon name={icon} size="m" />,
    ...otherProps,
  };

  return (
    <TooltipTrigger delay={0}>
      {isLink(props) ? (
        <Link {...commonProps} to={getPath(props.to, props.params)} />
      ) : (
        <Button {...commonProps} onClick={props.onClick} />
      )}
      <Tooltip className={styles.tooltip}>{label}</Tooltip>
    </TooltipTrigger>
  );
}
