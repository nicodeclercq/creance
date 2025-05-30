import { CardBoxIllustration } from "./CardBoxIllustration";
import { CardOutOfStackIllustration } from "./CardOutOfStaskIllustration";
import { CardStackIllustration } from "./CardStackIllustration";

export const ILLUSTRATIONS = {
  "card-stack": CardStackIllustration,
  "card-out-of-stack": CardOutOfStackIllustration,
  "card-box": CardBoxIllustration,
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;
