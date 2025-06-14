import classNames from "classnames";
import styles from "./Button.module.css";
import { Icon, type IconProps } from "../Icon/Icon";
import { Link } from "react-router-dom";
import { getPath, RouteName } from "../../routes";
import { Columns } from "../Columns/Columns";
import { LoadingIcon } from "./LoadingIcon";

type CommonProps = {
  label: string;
  icon?: {
    name: IconProps["name"];
    position?: "start" | "end";
  };
  variant?: "primary" | "secondary" | "tertiary";
  overlays?: boolean;
};

export type AsLink = {
  as: "link";
  type?: undefined;
  to: RouteName;
  params?: Record<string, string | number>;
};

export type AsButton = {
  as?: "button";
  type?: "button" | "submit" | "reset";
  onClick: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
};
export type ButtonProps<T extends AsLink | AsButton = AsLink | AsButton> =
  CommonProps & T;

function isLink(props: ButtonProps): props is CommonProps & AsLink {
  return props.as === "link";
}

export function Button(props: ButtonProps) {
  const { icon, label, variant = "primary", overlays = false } = props;

  const commonProps = {
    className: classNames(styles.button, styles[`hasVariant-${variant}`], {
      [styles.isLoading]: !isLink(props) && props.isLoading,
      [styles.isOverlay]: overlays,
    }),
    children: (
      <Columns
        align="center"
        justify="center"
        gap="s"
        styles={{ background: "transparent" }}
      >
        {icon?.position === "start" && <Icon name={icon.name} />}
        <span className={styles.label}>{label}</span>
        {icon?.position === "end" && <Icon name={icon.name} />}
      </Columns>
    ),
  };

  return isLink(props) ? (
    <Link {...commonProps} to={getPath(props.to, props.params)} />
  ) : (
    <button
      {...commonProps}
      onClick={props.onClick}
      disabled={props.isDisabled || props.isLoading}
    >
      <span className={styles.contentWrapper}>
        <span className={styles.loader}>
          {props.isLoading ? <LoadingIcon /> : <></>}
        </span>
        <span className={styles.content}>{commonProps.children}</span>
      </span>
    </button>
  );
}
