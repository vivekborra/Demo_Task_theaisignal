import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["STUDENT", "RECRUITER"]),
    companyName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "RECRUITER" && (!data.companyName || data.companyName.trim().length === 0)) {
        return false;
      }
      return true;
    },
    {
      message: "Company name is required for recruiter registration",
      path: ["companyName"],
    }
  );

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
