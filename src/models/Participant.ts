import { ParticipantShare } from "./ParticipantShare";

export type Participant = {
  _id: string;
  name: string;
  avatar?: string;
  share: {
    adults: number;
    children: number;
  };
  participantShare: ParticipantShare;
  updatedAt: Date;
};
