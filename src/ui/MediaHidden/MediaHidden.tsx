import { Container, type ContainerStyles } from "../Container/Container";
import {
  type Display,
  type Media,
  MEDIAS,
  WithMediaQuery,
} from "../Container/styles";

import { type ReactNode } from "react";

type MediaHiddenProps = {
  children: ReactNode;
  media: Media | Media[];
  styles?: Omit<ContainerStyles, "display"> & { display?: Display };
};

export function MediaHidden({
  children,
  media,
  styles = {},
}: MediaHiddenProps) {
  const { display = "default", ...otherStyles } = styles;
  const medias = media instanceof Array ? media : [media];

  const mediaQuery = MEDIAS.reduce(
    (acc, key) => ({
      ...acc,
      [key]: medias.includes(key) ? "none" : display,
    }),
    {}
  ) as WithMediaQuery<Display>;

  return (
    <Container
      styles={{
        ...otherStyles,
        display: mediaQuery,
      }}
    >
      {children}
    </Container>
  );
}
