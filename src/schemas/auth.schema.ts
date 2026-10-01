import { z } from "zod";

// bcrypt silently truncates beyond 72 bytes, so cap the input rather than accept a
// password whose tail is ignored.
const password = z.string().min(12).max(72);

export const registerSchema = z.object({
  first_name: z.string().trim().min(1).max(100),
  last_name: z.string().trim().min(1).max(100),
  email: z.email().max(191),
  password,
  // Defaulted to null rather than left optional so it matches the nullable column.
  team_id: z.number().int().positive().nullable().default(null),
});

export const loginSchema = z.object({
  email: z.email().max(191),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
