import * as z from "zod";

export const periodSchema = z.strictObject({
  start: z.union([z.string().transform((date) => new Date(date)), z.date()]),
  end: z.union([z.string().transform((date) => new Date(date)), z.date()]),
  arrival: z.union(
    [z.literal("AM"), z.literal("PM")],
    "Period.validation.arrival.invalid"
  ),
  departure: z.union(
    [z.literal("AM"), z.literal("PM")],
    "Period.validation.departure.invalid"
  ),
});

export type Period = z.infer<typeof periodSchema>;
