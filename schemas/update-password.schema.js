import * as z from "zod";

export const UpdatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, { message: "Old password cannot be empty" }),
    newPassword: z
      .string()
      .min(8, { message: "New password must be min 8 characters long!" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be min 8 characters long!" }),
  })
  .refine((values) => values.newPassword !== values.oldPassword, {
    message: "Old Password and New Password cannot be the same!",
    path: ["newPassword"],
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "New Password and Confirm Password do not match!",
    path: ["confirmPassword"],
  });
