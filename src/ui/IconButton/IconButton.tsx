import classNames from "classnames";
import buttonStyles from "../Button/Button.module.css";
import styles from "./IconButton.module.css";
import { Icon, type IconProps } from "../Icon/Icon";
import { Link } from "react-router-dom";
import { getPath, Params, RouteName } from "../../routes";
import { Button, Tooltip, TooltipTrigger } from "react-aria-components";

type CommonProps = {
  label: string;
  icon: IconProps["name"];
};

export type AsLink<R extends RouteName = RouteName> =
  Params<R> extends undefined
    ? {
        as: "link";
        to: R;
      }
    : {
        as: "link";
        to: R;
        params: Params<R>;
      };

export type AsButton = {
  as?: "button";
  type?: "button";
  onClick?: () => void;
};

export type IconButtonPropsWhithoutVariantAndOverlays<
  T extends AsLink<RouteName> | AsButton = AsLink<RouteName> | AsButton
> = CommonProps & T;

export type IconButtonProps<
  T extends AsLink<RouteName> | AsButton = AsLink<RouteName> | AsButton
> = IconButtonPropsWhithoutVariantAndOverlays<T> & {
  variant?: "primary" | "secondary" | "tertiary";
  overlays?: boolean;
};

export function isButton<R extends RouteName>(
  props: IconButtonProps<AsLink<R> | AsButton>
): props is CommonProps & AsButton {
  return props.as === "button" || props.as == null;
}

export function IconButton<T extends AsLink<RouteName> | AsButton>(
  props: IconButtonProps<T>
) {
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
      {isButton(props) ? (
        <Button type="button" {...commonProps} onClick={props.onClick} />
      ) : (
        <Link
          {...commonProps}
          to={
            "params" in props
              ? getPath(props.to, props.params as Record<string, string>)
              : getPath(props.to)
          }
        />
      )}
      <Tooltip className={styles.tooltip}>{label}</Tooltip>
    </TooltipTrigger>
  );
}
