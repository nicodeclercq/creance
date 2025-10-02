import classNames from "classnames";
import styles from "./Button.module.css";
import { Icon, type IconProps } from "../Icon/Icon";
import { Link } from "react-router-dom";
import { getPath, RouteName } from "../../routes";
import { Columns } from "../Columns/Columns";
import { LoadingIcon } from "./LoadingIcon";
import { useEffect, useRef, useState } from "react";

const WAITING_TIME = 1000; // milliseconds
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  hash?: string;
};

export type AsButton = {
  as?: "button";
  type?: "button" | "submit" | "reset";
  onClick: () => Promise<void> | void;
  isDisabled?: boolean;
  isLoading?: boolean;
};
export type ButtonProps<T extends AsLink | AsButton = AsLink | AsButton> =
  CommonProps & T;

function isLink(props: ButtonProps): props is CommonProps & AsLink {
  return props.as === "link";
}

export function Button(props: ButtonProps) {
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const { icon, label, variant = "primary", overlays = false } = props;

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const commonProps = {
    className: classNames(styles.button, styles[`hasVariant-${variant}`], {
      [styles.isLoading]: !isLink(props) && (props.isLoading || isLoading),
      [styles.isOverlay]: overlays,
    }),
    "data-component": "Button",
    children: (
      <Columns align="center" justify="center" gap="s">
        {icon?.position === "start" && <Icon name={icon.name} />}
        <span className={styles.label}>{label}</span>
        {icon?.position === "end" && <Icon name={icon.name} />}
      </Columns>
    ),
  };

  const click = () => {
    if (!isLink(props)) {
      const result = props.onClick();
      if (result instanceof Promise) {
        setIsLoading(true);
        // stays loading for a minimum time
        Promise.all([result, wait(WAITING_TIME)]).finally(() => {
          if (isMounted.current) {
            setIsLoading(false);
          }
        });
      }
    }
  };

  return isLink(props) ? (
    <Link {...commonProps} to={getPath(props.to, props.params, props.hash)} />
  ) : (
    <button
      {...commonProps}
      type={props.type || "button"}
      onClick={click}
      disabled={props.isDisabled || props.isLoading || isLoading}
    >
      <span className={styles.contentWrapper}>
        <span className={styles.loader}>
          {props.isLoading || isLoading ? <LoadingIcon /> : <></>}
        </span>
        <span className={styles.content}>{commonProps.children}</span>
      </span>
    </button>
  );
}
