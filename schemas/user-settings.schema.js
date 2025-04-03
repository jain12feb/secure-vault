import * as z from "zod";

export const settingsFormSchema = z.object({
  twoFactorAuth: z.boolean().default(false),
  passwordStrength: z.enum(["low", "medium", "high"]),
  sessionTimeout: z.number().min(5).max(60),
  darkMode: z.boolean().default(false),
  sidebarLayout: z.enum(["sidebar", "floating"]),
});
