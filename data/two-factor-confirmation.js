import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId) => {
  try {
    const twofactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId },
    });
    return twofactorConfirmation;
  } catch (error) {
    return null;
  }
};
