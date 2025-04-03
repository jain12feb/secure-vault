import { db } from "@/lib/db";

export const getTwoFactorTokenByEmail = async (email) => {
  try {
    const twofactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    });
    return twofactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token) => {
  try {
    const twofactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    });
    return twofactorToken;
  } catch (error) {
    return null;
  }
};
