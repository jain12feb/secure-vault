"use server";

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    return {
      success: true,
      type: "success",
      message: "Allowed Server Actions",
    };
  }

  return {
    success: false,
    type: "error",
    message: "Forbidden",
  };
};
