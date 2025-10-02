import { Avatar, AvatarProps } from "../Avatar/Avatar";

import classNames from "classnames";
import styles from "./AvatarGroup.module.css";

const MAX_UNTIL_CONDENSED = 5;
const MAX_SHOWN = 10;

type AvatarGroupProps = {
  avatars: Omit<AvatarProps, "size">[];
  size?: AvatarProps["size"];
};

export function AvatarGroup({ avatars, size }: AvatarGroupProps) {
  const shownAvatars = avatars.slice(0, MAX_SHOWN);
  const unshownAvatarNb = avatars.length - shownAvatars.length;

  return (
    <div
      data-component="AvatarGroup"
      className={classNames(styles.group, {
        [styles.isCondensed]: avatars.length > MAX_UNTIL_CONDENSED,
      })}
    >
      {shownAvatars.map((avatar) => (
        <Avatar key={avatar.label} {...avatar} size={size} />
      ))}
      {shownAvatars.length !== avatars.length && (
        <Avatar
          label={
            unshownAvatarNb >= 10 && size === "s" ? "№" : `+${unshownAvatarNb}` // avoid two digit numbers in small size
          }
          image={""}
          size={size}
        />
      )}
    </div>
  );
}
