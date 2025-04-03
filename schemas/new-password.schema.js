import * as z from "zod";

export const NewPasswordSchema = z
  .object({
    password: z.string().min(8, {message: "New password must be 8 characters long!"}),
    confirmPassword: z
      .string()
      .min(8, {message: "Confirm password must be 8 characters long!"}),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "New Password & Confirm Password don't match!",
      path: ["confirmPassword"],
    }
  );
