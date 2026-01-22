import z from "zod";

export const createLeaveRequestSchema = z.object({
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  reason: z.
    string()
    .trim()
    .min(1, 'Reason is required')
  ,
})
