import { z } from "zod";

export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
});
