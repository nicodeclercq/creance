import * as z from "zod";

export const periodSchema = z.strictObject({
  start: z.string().transform((date) => new Date(date)),
  end: z.string().transform((date) => new Date(date)),
  arrival: z.enum(["AM", "PM"]),
  departure: z.enum(["AM", "PM"]),
});

export type Period = z.infer<typeof periodSchema>;
