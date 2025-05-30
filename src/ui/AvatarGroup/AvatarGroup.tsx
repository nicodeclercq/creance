import { Avatar, AvatarProps } from "../Avatar/Avatar";

import classNames from "classnames";
import styles from "./AvatarGroup.module.css";

type AvatarGroupProps = {
  avatars: Omit<AvatarProps, "size">[];
  size?: AvatarProps["size"];
};

export function AvatarGroup({ avatars, size }: AvatarGroupProps) {
  return (
    <div
      className={classNames(styles.group, {
        [styles.isCondensed]: avatars.length > 5,
      })}
    >
      {avatars.map((avatar) => (
        <Avatar key={avatar.label} {...avatar} size={size} />
      ))}
    </div>
  );
}
