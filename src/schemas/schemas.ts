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
  role_id: z.string(),
  phone_number: z
    .string()
    .min(9, "Phone number is too short")
    .optional()
    .or(z.literal("")),
  // restaurant_id: z.string().optional(),
});

export type CreateRestaurantAdminValues = z.infer<
  typeof createRestaurantAdminSchema
>;

// Role Schema
export const createRoleFormSchema = z.object({
  name: z.string().min(1, "Role name is required."),
  description: z.string().optional().or(z.literal("")),
  permissionIds: z.array(z.string()).optional(),
  role_tag_id: z.string(),
});

export type RoleFormValues = z.infer<typeof createRoleFormSchema>;

// Plans Schema
export const PLAN_NAMES = ["Basic", "Pro", "Enterprise"] as const;
export const BILLING_CYCLES = ["monthly", "yearly"] as const;
export const DATA_TYPES = ["number", "boolean", "string"] as const;

export const planLimitSchema = z.object({
  key: z.string().min(1, "Plan limit key is required"),
  value: z
    .union([z.string(), z.number(), z.boolean()])
    .refine((val) => val !== "", { message: "Plan limit value is required" }),
  data_type: z.enum(DATA_TYPES, {
    message: "Invalid data type",
  }),
  description: z.string().optional(),
});

export const createPlanSchema = z.object({
  name: z.enum(PLAN_NAMES, {
    message: "Invalid plan name",
  }),
  price: z.coerce.number().positive("Price must be greater than zero"),

  billing_cycle: z.enum(BILLING_CYCLES, {
    message: "Invalid billing cycle",
  }),
  plan_limits: z.array(planLimitSchema).optional(),
});

export type CreatePlanValues = z.infer<typeof createPlanSchema>;
