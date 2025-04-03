import { db } from "./db";
import { getVerificationTokenByEmail } from "@/data/verificationToken";
import { getPasswordResetTokenByEmail } from "@/data/passwordResetToken";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import crypto from "crypto";
const jwt = require("jsonwebtoken");

export const generateVerificationToken = async (email) => {
  // const token = uuid({
  //   version: 4,
  // });

  const secretKey = "your_secret_key_here"; // Replace with your secret key
  const expiresIn = "5m"; // Token expiration time, e.g., 5 minutes

  // Payload for JWT token, you can include any data you want here
  const payload = {
    email: email,
    type: "email_verification",
  };

  // Generate JWT token
  const token = jwt.sign(payload, secretKey, { expiresIn });

  const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      token,
      email,
      expires,
    },
  });

  console.log("verificationToken", verificationToken);

  return verificationToken;
};

export const generatePasswordResetToken = async (email) => {
  const secretKey = "your_secret_key_here"; // Replace with your secret key
  const expiresIn = "5m"; // Token expiration time, e.g., 5 minutes

  // Payload for JWT token, you can include any data you want here
  const payload = {
    email: email,
    type: "password_reset",
  };

  // Generate JWT token
  const token = jwt.sign(payload, secretKey, { expiresIn });

  // Save the token in your database or wherever you need
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      token,
      email,
      expires,
    },
  });

  return passwordResetToken;
};

// export const generatePasswordResetToken = async (email) => {
//   const token = uuid({
//     version: 4,
//   });

//   const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes

//   const existingToken = await getPasswordResetTokenByEmail(email);

//   if (existingToken) {
//     await db.passwordResetToken.delete({
//       where: {
//         id: existingToken.id,
//       },
//     });
//   }

//   const passwordResetToken = await db.passwordResetToken.create({
//     data: {
//       token,
//       email,
//       expires,
//     },
//   });

//   console.log("passwordResetToken", passwordResetToken);

//   return passwordResetToken;
// };

export const generateTwoFactorToken = async (email) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();

  const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      token,
      email,
      expires,
    },
  });

  console.log("twoFactorToken", twoFactorToken);

  return twoFactorToken;
};
