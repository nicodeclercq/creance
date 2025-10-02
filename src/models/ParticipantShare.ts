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
    z.string().min(8).max(10),
    z.partialRecord(
      z.union([z.literal("AM"), z.literal("PM")]),
      z.strictObject({
        adults: z.number(),
        children: z.number(),
      })
    )
  ),
});
export type DailyParticipantShare = z.infer<typeof dailyParticipantShareSchema>;

export const customParticipantShareSchema = z.strictObject({
  type: z.literal("custom"),
  shares: z.array(
    z.strictObject({
      label: z.string().max(100),
      multiplier: z.strictObject({
        adults: z.number(),
        children: z.number(),
      }),
      period: z.strictObject({
        start: z.string().transform((date) => new Date(date)),
        end: z.string().transform((date) => new Date(date)),
        arrival: z.enum(["AM", "PM"]),
        departure: z.enum(["AM", "PM"]),
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
