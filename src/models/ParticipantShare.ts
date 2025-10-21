import * as z from "zod";

export const defaultParticipantShareSchema = z.strictObject({
  type: z.literal("default"),
});
export type DefaultParticipantShare = z.infer<
  typeof defaultParticipantShareSchema
>;

export const dailyParticipantShareSchema = z.strictObject({
  type: z.literal("daily"),
  periods: z.record(
    z
      .string()
      .min(8, "ParticipantShare.validation.periods.key.minLength")
      .max(10, "ParticipantShare.validation.periods.key.maxLength"),
    z.partialRecord(
      z.union([z.literal("AM"), z.literal("PM")]),
      z.strictObject({
        adults: z.number("ParticipantShare.validation.adults.invalid"),
        children: z.number("ParticipantShare.validation.children.invalid"),
      })
    )
  ),
});
export type DailyParticipantShare = z.infer<typeof dailyParticipantShareSchema>;

export const customParticipantShareSchema = z.strictObject({
  type: z.literal("custom"),
  shares: z.array(
    z.strictObject({
      label: z.string().max(100, "ParticipantShare.validation.label.maxLength"),
      multiplier: z.strictObject({
        adults: z.number(
          "ParticipantShare.validation.multiplier.adults.invalid"
        ),
        children: z.number(
          "ParticipantShare.validation.multiplier.children.invalid"
        ),
      }),
      period: z.strictObject({
        start: z.union([
          z.string().transform((date) => new Date(date)),
          z.date(),
        ]),
        end: z.union([
          z.string().transform((date) => new Date(date)),
          z.date(),
        ]),
        arrival: z.union(
          [z.literal("AM"), z.literal("PM")],
          "ParticipantShare.validation.period.arrival.invalid"
        ),
        departure: z.union(
          [z.literal("AM"), z.literal("PM")],
          "ParticipantShare.validation.period.departure.invalid"
        ),
      }),
    })
  ),
});
export type CustomParticipantShare = z.infer<
  typeof customParticipantShareSchema
>;

export const participantShareSchema = z.union([
  defaultParticipantShareSchema,
  dailyParticipantShareSchema,
  customParticipantShareSchema,
]);
export type ParticipantShare = z.infer<typeof participantShareSchema>;

export const foldParticipantShare =
  <T>({
    onDefault,
    onDaily,
    onCustom,
  }: {
    onDefault: (share: DefaultParticipantShare) => T;
    onDaily: (share: DailyParticipantShare) => T;
    onCustom: (share: CustomParticipantShare) => T;
  }) =>
  (share: ParticipantShare): T => {
    switch (share.type) {
      case "default":
        return onDefault(share);
      case "daily":
        return onDaily(share);
      case "custom":
        return onCustom(share);
    }
  };
