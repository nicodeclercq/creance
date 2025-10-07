import {
  Container,
  type ContainerStyles,
  type Display,
  type Media,
  MEDIAS,
  type WithMediaQuery,
} from "../Container/Container";

import { type ReactNode } from "react";

type MediaOnlyProps = {
  children: ReactNode;
  media: Media | Media[];
  styles?: Omit<ContainerStyles, "display"> & { display?: Display };
};

export function MediaOnly({ children, media, styles = {} }: MediaOnlyProps) {
  const { display = "default", ...otherStyles } = styles;
  const medias = media instanceof Array ? media : [media];

  const mediaQuery = MEDIAS.reduce(
    (acc, key) => ({
      ...acc,
      [key]: medias.includes(key) ? display : "none",
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
