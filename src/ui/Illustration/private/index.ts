import { CardBoxIllustration } from "./CardBoxIllustration";
import { CardOutOfStackIllustration } from "./CardOutOfStaskIllustration";
import { CardStackIllustration } from "./CardStackIllustration";
import { PigHappyIllustration } from "./PigHappyIllustration";

export const ILLUSTRATIONS = {
  "card-stack": CardStackIllustration,
  "card-out-of-stack": CardOutOfStackIllustration,
  "card-box": CardBoxIllustration,
  "pig-happy": PigHappyIllustration,
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;
