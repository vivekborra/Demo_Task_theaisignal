import { z } from "zod";

export const applySchema = z.object({
  coverNote: z.string().max(1000, "Cover note cannot exceed 1000 characters").optional().nullable(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["APPLIED", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"]),
});

export type ApplyInput = z.infer<typeof applySchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
