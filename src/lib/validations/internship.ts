import { z } from "zod";

export const internshipSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120, "Title is too long"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  responsibilities: z.array(z.string()).min(1, "At least one responsibility is required"),
  requirements: z.array(z.string()).min(1, "At least one requirement is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  location: z.string().min(2, "Location is required"),
  workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]),
  stipend: z.number().int().nonnegative("Stipend must be 0 or greater"),
  durationMonths: z.number().int().positive("Duration must be at least 1 month"),
  deadline: z.string().or(z.date()).refine((val) => {
    const d = new Date(val);
    return !isNaN(d.getTime());
  }, "Invalid deadline date"),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).default("PUBLISHED"),
});

export const internshipQuerySchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]).optional(),
  minStipend: z.coerce.number().optional(),
  skills: z.string().optional(), // comma-separated
  sort: z.enum(["recent", "deadline", "stipend"]).default("recent"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type InternshipInput = z.infer<typeof internshipSchema>;
export type InternshipQueryInput = z.infer<typeof internshipQuerySchema>;
