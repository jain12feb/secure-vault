import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const enableTwoFactorAuth = async () => {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      type: "error",
      message: "Unauthorized",
    };
  }

  // Check if 2FA is already enabled
  if (user.isTwoFactorEnabled) {
    return {
      success: false,
      type: "error",
      message: "Two-factor authentication is already enabled.",
    };
  }

  // Generate a new secret for TOTP
  const secret = speakeasy.generateSecret({ length: 20 });

  // Generate a QR code that the user can scan with their 2FA app
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

  // Store the secret in the database and enable 2FA
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      isTwoFactorEnabled: true,
      twoFactorSecret: secret.base32, // Save the base32 secret in the database
    },
  });

  return {
    success: true,
    qrCodeUrl,
    secret: secret.base32,
  };
};

export const disableTwoFactorAuth = async () => {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      type: "error",
      message: "Unauthorized",
    };
  }

  // Check if 2FA is already disabled
  if (!user.isTwoFactorEnabled) {
    return {
      success: false,
      type: "error",
      message: "Two-factor authentication is not enabled.",
    };
  }

  // Disable 2FA and clear the stored secret
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      isTwoFactorEnabled: false,
      twoFactorSecret: null, // Clear the stored secret
    },
  });

  return {
    success: true,
    type: "success",
    message: "Two-factor authentication disabled successfully.",
  };
};

export const verifyTwoFactorCode = async (code) => {
  const user = await currentUser();

  if (!user || !user.twoFactorSecret) {
    return {
      success: false,
      type: "error",
      message: "Unauthorized or 2FA not enabled",
    };
  }

  // Verify the code using speakeasy
  const isVerified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: code,
  });

  if (!isVerified) {
    return {
      success: false,
      type: "error",
      message: "Invalid 2FA code",
    };
  }

  return {
    success: true,
    type: "success",
    message: "2FA code verified successfully.",
  };
};
