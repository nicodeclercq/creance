import * as z from "zod";

import { participantShareSchema } from "./ParticipantShare";
import { userSchema } from "./User";

export const participantSchema = userSchema.extend({
  participantShare: participantShareSchema,
});

export type Participant = z.infer<typeof participantSchema>;
