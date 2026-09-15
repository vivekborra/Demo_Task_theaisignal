import { z } from "zod";

export const educationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(2, "Degree is required"),
  institution: z.string().min(2, "Institution is required"),
  fieldOfStudy: z.string().min(2, "Field of study is required"),
  startYear: z.number().int().min(1970).max(2035),
  endYear: z.number().int().min(1970).max(2035).optional().nullable(),
});

export const studentProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  headline: z.string().max(160, "Headline must be under 160 characters").optional().nullable(),
  bio: z.string().max(1000, "Bio must be under 1000 characters").optional().nullable(),
  skills: z.array(z.string()),
  resumeUrl: z.string().url("Please enter a valid URL").or(z.literal("")).optional().nullable(),
  linkedinUrl: z.string().url("Please enter a valid LinkedIn URL").or(z.literal("")).optional().nullable(),
  githubUrl: z.string().url("Please enter a valid GitHub URL").or(z.literal("")).optional().nullable(),
  portfolioUrl: z.string().url("Please enter a valid Portfolio URL").or(z.literal("")).optional().nullable(),
  education: z.array(educationSchema).optional(),
});

export const companyProfileSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  logoUrl: z.string().url("Invalid logo URL").or(z.literal("")).optional().nullable(),
  website: z.string().url("Invalid website URL").or(z.literal("")).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  location: z.string().optional().nullable(),
  industry: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
