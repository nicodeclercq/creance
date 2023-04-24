import React from "react";
import { __PigIllustration } from "./__illustrations/__PigIllustration";

const illustrations = {
  pig: __PigIllustration,
} as const;

type IllustrationName = keyof typeof illustrations;

type Props = {
  name: IllustrationName;
  width?: string;
  height?: string;
};

export function Illustration({ name, width, height }: Props) {
  const Component = illustrations[name];

  return <Component width={width} height={height} />;
}
