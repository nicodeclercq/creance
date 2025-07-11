import { ParticipantShare } from "./ParticipantShare";
import { User } from "./User";

export type Participant = User & {
  participantShare: ParticipantShare;
};
