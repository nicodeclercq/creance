import * as z from "zod";

export const activitySchema = z.strictObject({
  _id: z.string().max(100),
  name: z.string().max(100),
  description: z.string().max(100),
  isAllDay: z.boolean(),
  startDate: z.string().transform((date) => new Date(date)),
  endDate: z
    .string()
    .transform((date) => new Date(date))
    .optional(),
  proposedBy: z.string().max(100),
  url: z.string().max(250).optional(),
  reservationRequired: z.boolean(),
  updatedAt: z.string().transform((date) => new Date(date)),
  image: z.string().max(150).optional(),
});

export type Activity = z.infer<typeof activitySchema>;
