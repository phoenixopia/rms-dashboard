import { z } from "zod";

export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
});

export const createRestaurantSchema = z.object({
  restaurant_name: z
    .string()
    .min(3, "Restaurant name must be at least 3 characters long"),
  restaurant_admin_id: z.string().nullish(),
  language: z.string().optional(),
  theme: z.enum(["Light", "Dark", "System"]).optional(),
  primary_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format")
    .optional(),
  rtl_enabled: z.boolean().optional(),
});

export type CreateRestaurantFormValues = z.infer<typeof createRestaurantSchema>;

export const createRestaurantAdminSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  creatorMode: z.enum(["email", "phone"]),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone_number: z
    .string()
    .min(9, "Phone number is too short")
    .optional()
    .or(z.literal("")),
  restaurant_id: z.string().optional(),
});

export type CreateRestaurantAdminValues = z.infer<
  typeof createRestaurantAdminSchema
>;

// Role Schema
export const createRoleFormSchema = z.object({
  name: z.string().min(1, "Role name is required."),
  description: z.string().optional().or(z.literal("")),
  permissions: z.array(z.string()).optional(),
});

export type RoleFormValues = z.infer<typeof createRoleFormSchema>;
