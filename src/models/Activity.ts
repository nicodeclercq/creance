import * as z from "zod";

export const activitySchema = z.strictObject({
  _id: z.string().max(100, "Activity.validation.id.maxLength"),
  name: z.string().max(100, "Activity.validation.name.maxLength"),
  description: z.string().max(100, "Activity.validation.description.maxLength"),
  isAllDay: z.boolean("Activity.validation.isAllDay"),
  startDate: z.union(
    [z.string().transform((date) => new Date(date)), z.date()],
    "Activity.validation.startDate.invalid"
  ),
  endDate: z
    .union(
      [z.string().transform((date) => new Date(date)), z.date()],
      "Activity.validation.endDate.invalid"
    )
    .optional(),
  proposedBy: z.string().max(100, "Activity.validation.proposedBy.maxLength"),
  url: z.string().max(250, "Activity.validation.url.maxLength").optional(),
  reservationRequired: z.boolean("Activity.validation.reservationRequired"),
  updatedAt: z.union([
    z.string().transform((date) => new Date(date)),
    z.date(),
  ]),
  image: z.string().max(150, "Activity.validation.image.maxLength").optional(),
});

export type Activity = z.infer<typeof activitySchema>;
