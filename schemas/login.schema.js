import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Please enter 6 characters long password" }),
  code: z.string().min(6, { message: "6 digit code must required" }).optional(),
});
