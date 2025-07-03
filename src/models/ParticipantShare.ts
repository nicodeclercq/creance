export type DefaultParticipantShare = {
  type: "default";
};

export type CustomParticipantShareType = {
  label: string;
  multiplier: {
    adults: number;
    children: number;
  };
  period: {
    start: Date;
    end: Date;
    arrival: "AM" | "PM";
    departure: "AM" | "PM";
  };
};

export type CustomParticipantShare = {
  type: "custom";
  shares: CustomParticipantShareType[];
};

export type ParticipantShare = DefaultParticipantShare | CustomParticipantShare;

export const foldParticipantShare =
  <T>({
    onDefault,
    onCustom,
  }: {
    onDefault: (share: DefaultParticipantShare) => T;
    onCustom: (share: CustomParticipantShare) => T;
  }) =>
  (share: ParticipantShare) => {
    switch (share.type) {
      case "default":
        return onDefault(share);
      case "custom":
        return onCustom(share);
    }
  };
