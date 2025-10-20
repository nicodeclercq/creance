import { CardBoxIllustration } from "./CardBoxIllustration";
import { CardOutOfStackIllustration } from "./CardOutOfStaskIllustration";
import { CardStackIllustration } from "./CardStackIllustration";
import { EmptyBoxIllustration } from "./EmptyBoxIllustration";
import { NoodlesIllustration } from "./NoodlesIllustration";
import { PigHappyIllustration } from "./PigHappyIllustration";
import { PigIsleIllustration } from "./PigIsleIllustration";

export const ILLUSTRATIONS = {
  "card-stack": CardStackIllustration,
  "card-out-of-stack": CardOutOfStackIllustration,
  "card-box": CardBoxIllustration,
  "pig-happy": PigHappyIllustration,
  "pig-isle": PigIsleIllustration,
  "empty-box": EmptyBoxIllustration,
  noodles: NoodlesIllustration,
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;
