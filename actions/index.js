"use server";

import { db } from "@/lib/db";
import { ForgotPasswordSchema } from "@/schemas/forgot-password.schema";
import { NewPasswordSchema } from "@/schemas/new-password.schema";
import { RegisterSchema } from "@/schemas/register.schema";
import { LoginSchema } from "@/schemas/login.schema";
import bcryptjs from "bcryptjs";
import { getUserByEmail, getUserById } from "../data/user";
import { auth, signIn, signOut } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import {
  sendPasswordResetEmail,
  sendTwoFactorTokenEmail,
  sendVerificationEmail,
} from "@/lib/mail";
import { getVerificationTokenByToken } from "../data/verificationToken";
import { getPasswordResetTokenByToken } from "../data/passwordResetToken";
import { getTwoFactorTokenByEmail } from "../data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "../data/two-factor-confirmation";
import { deleteSession } from "./session-actions";

const jwt = require("jsonwebtoken");

export const login = async (loginFormData, callbackUrl) => {
  const validatedData = LoginSchema.safeParse(loginFormData);

  console.log("loginFormData", loginFormData);

  if (!validatedData?.success) {
    return {
      success: false,
      type: "error",
      message: "Please fill all the fields!",
    };
  }

  const { email, password, code } = validatedData?.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return {
      success: false,
      type: "error",
      message: "No account found!",
    };
  }

  if (!existingUser.password) {
    return {
      success: false,
      type: "info",
      message: "Try login with social account",
    };
  }

  // if (!existingUser.password) {
  //   return {
  //     success: false,
  //     type: "error",
  //     message: "Login with Google or Github!",
  //   };
  // }

  const isPasswordMatched = await bcryptjs.compare(
    password,
    existingUser.password
  );

  if (!isPasswordMatched) {
    return {
      success: false,
      type: "error",
      message: "Incorrect Password",
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: true,
      type: "success",
      message: "Verification email sent!",
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // verify code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return {
          success: false,
          type: "error",
          message: "No authentication code found!",
          path: "2fa",
          twofactor: true,
        };
      }

      if (twoFactorToken.token !== code) {
        return {
          success: false,
          type: "error",
          message: "Invalid code!",
          path: "2fa",
          twofactor: true,
        };
      }

      const has2FAExpired = new Date(twoFactorToken.expires) < new Date();

      if (has2FAExpired) {
        return {
          success: false,
          type: "error",
          message: "Authentication code expired!",
          path: "2fa",
          twofactor: true,
        };
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser?.email);

      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return {
        success: true,
        type: "success",
        message: "Authentication code sent on email!",
        twofactor: true,
      };
    }
  }

  try {
    const redirectUrl = await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
      redirect: false,
    });

    return {
      success: true,
      type: "success",
      message: "Welcome back " + existingUser.name.split(" ")[0],
      redirectUrl,
    };
  } catch (error) {
    // console.log("login action", { error });

    // if (isRedirectError(error)) { // Redirect error handle here
    //   throw error // You have to throw the redirect error
    // }

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
          return {
            success: false,
            type: "error",
            message: error?.cause?.err?.toString()?.split(": ")[1],
          };
        case "CredentialsSignin":
          return {
            success: false,
            type: "error",
            message: "Invalid credentials!",
          };
        case "AccessDenied":
          return {
            success: false,
            type: "error",
            message: error?.cause?.err?.toString()?.split(": ")[1],
            // text: "verify",
          };
        case "OAuthAccountNotLinked":
          return {
            success: false,
            type: "error",
            message: "Account already exists!",
          };
        case "OAuthCallbackError":
          return {
            success: false,
            type: "error",
            message: "Authentication request failed!",
          };
        default:
          return {
            success: false,
            type: "error",
            message: "Something went wrong!",
          };
      }
    }

    throw error;
  }
};

// resend two factor authentication code
export const resendTwoFactorAuthenticationCode = async (email) => {
  const twoFactorToken = await generateTwoFactorToken(email);

  await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

  return {
    success: true,
    type: "success",
    message: "Please check your email for the new OTP.",
    twofactor: true,
  };
};

export const register = async (registerFormData) => {
  const validatedData = RegisterSchema.safeParse(registerFormData);

  if (!validatedData?.success) {
    return {
      success: false,
      type: "error",
      message: "Please fill all the fields!",
    };
  }

  const { name, email, password } = validatedData?.data;

  const isEmailTaken = await getUserByEmail(email);

  if (isEmailTaken) {
    return {
      success: false,
      type: "error",
      message: "Account already exists!",
    };
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // send verification token to email
  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: true,
    type: "success",
    message: "Verification email sent!",
  };
};

export const socialSignIn = async (provider) => {
  await signIn(provider, {
    callbackUrl: DEFAULT_LOGIN_REDIRECT,
  });
};

export const newVerification = async (token) => {
  try {
    const secretKey = "your_secret_key_here"; // Replace with your secret key
    const decodedToken = jwt.verify(token, secretKey);

    // Check if the token is expired
    if (decodedToken.exp < Date.now() / 1000) {
      return {
        success: false,
        type: "error",
        message: "Token has expired!",
      };
    }

    const tokenFromDB = await getVerificationTokenByToken(token);

    if (!tokenFromDB) {
      return {
        success: false,
        type: "error",
        message: "No verification token found!",
      };
    }

    if (decodedToken.email !== tokenFromDB.email) {
      return {
        success: false,
        type: "error",
        message: "Use your own token!",
      };
    }

    const isTokenExpired = new Date(tokenFromDB.expires) < new Date();

    if (isTokenExpired) {
      await db.verificationToken.delete({
        where: {
          id: tokenFromDB.id,
        },
      });

      return {
        success: false,
        type: "error",
        message: "Token has expired!",
      };
    }

    const isUserExists = await getUserByEmail(tokenFromDB.email);

    if (!isUserExists) {
      return {
        success: false,
        type: "error",
        message: "No account found!",
      };
    }

    await db.user.update({
      where: {
        id: isUserExists.id,
      },
      data: {
        emailVerified: new Date(),
        email: isUserExists.email,
      },
    });

    await db.verificationToken.delete({
      where: {
        id: tokenFromDB.id,
      },
    });

    return {
      success: true,
      type: "success",
      message: "Your account has been activated.",
    };
  } catch (error) {
    // If token verification fails
    if (error instanceof jwt.TokenExpiredError) {
      return {
        success: false,
        type: "error",
        message: "Token has expired!",
      };
    }

    return {
      success: false,
      type: "error",
      message: "Invalid token!",
    };
  }
};

export const forgotPassword = async (values) => {
  const validatedFields = ForgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      type: "error",
      message: " Please enter your email address!",
    };
  }

  const { email } = validatedFields?.data;

  const user = await getUserByEmail(email);
  if (!user) {
    return {
      success: false,
      type: "error",
      message: "No account found!",
    };
  }

  // TODO: generate token and send email
  const resetPasswordToken = await generatePasswordResetToken(email);

  const isEmailSent = await sendPasswordResetEmail(
    resetPasswordToken.email,
    resetPasswordToken.token
  );

  if (!isEmailSent) {
    return {
      success: false,
      type: "error",
      message: "Failed to send password reset email",
    };
  }

  return {
    success: true,
    type: "success",
    message: "Password reset link sent on email!",
  };
};

export const newPassword = async (values, token) => {
  if (!token) {
    return {
      success: false,
      type: "error",
      message: "Missing token!",
    };
  }

  try {
    const secretKey = "your_secret_key_here"; // Replace with your secret key
    const decodedToken = jwt.verify(token, secretKey);

    // Check if the token is expired
    if (decodedToken.exp < Date.now() / 1000) {
      return {
        success: false,
        type: "error",
        message: "Token has expired!",
      };
    }

    // Retrieve the password reset token from the database
    const tokenFromDB = await getPasswordResetTokenByToken(token);

    if (!tokenFromDB) {
      return {
        success: false,
        type: "error",
        message: "No reset password token found!",
      };
    }

    if (decodedToken.email !== tokenFromDB.email) {
      return {
        success: false,
        type: "error",
        message: "Use your own token!",
      };
    }

    // Check if the token stored in the database is expired
    const isTokenExpired = new Date(tokenFromDB.expires) < new Date();

    if (isTokenExpired) {
      await db.passwordResetToken.delete({
        where: {
          id: tokenFromDB.id,
        },
      });

      return {
        success: false,
        type: "error",
        message: "Token has expired!",
      };
    }

    // Check if the email associated with the token exists
    const isUserExists = await getUserByEmail(tokenFromDB.email);

    if (!isUserExists) {
      return {
        success: false,
        type: "error",
        message: "No account found!",
      };
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        type: "error",
        message: "Please fill all the fields!",
      };
    }

    const { confirmPassword } = validatedFields.data;

    console.log("isUserExists", isUserExists);

    // Check if the new password is the same as the old one
    const isOldPassword = await bcryptjs.compare(
      confirmPassword,
      isUserExists.password
    );

    if (isOldPassword) {
      return {
        success: false,
        type: "error",
        message: "Cannot use old passwords!",
      };
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(confirmPassword, 10);

    // Update the user's password
    await db.user.update({
      where: {
        id: isUserExists.id,
      },
      data: {
        password: hashedPassword,
        email: isUserExists.email,
      },
    });

    // Delete the password reset token from the database
    await db.passwordResetToken.delete({
      where: {
        id: tokenFromDB.id,
      },
    });

    return {
      success: true,
      type: "success",
      message: "Congrats!!!. Your password has changed!",
    };
  } catch (error) {
    console.log(error);
    // If token verification fails
    if (error instanceof jwt.TokenExpiredError) {
      return {
        success: false,
        type: "error",
        message: "Token has expired!",
      };
    }
    return {
      success: false,
      type: "error",
      message: "Invalid token!",
    };
  }
};

// export const newPassword = async (values, token) => {
//   if (!token) {
//     return {
//       success: false,
//       type: "error",
//       message: "Missing token!",
//     };
//   }

//   const validatedFields = NewPasswordSchema.safeParse(values);

//   if (!validatedFields.success) {
//     return {
//       success: false,
//       type: "error",
//       message: "Please fill all the fields!",
//     };
//   }

//   const tokenFromDB = await getPasswordResetTokenByToken(token);

//   if (!tokenFromDB) {
//     return {
//       success: false,
//       type: "error",
//       message: "No reset password token found!",
//     };
//   }

//   const isTokenExpired = new Date(tokenFromDB.expires) < new Date();

//   if (isTokenExpired) {
//     await db.passwordResetToken.delete({
//       where: {
//         id: tokenFromDB.id,
//       },
//     });

//     return {
//       success: false,
//       type: "error",
//       message: "Token has expired!",
//     };
//   }

//   const isUserExists = await getUserByEmail(tokenFromDB.email);

//   if (!isUserExists) {
//     return {
//       success: false,
//       type: "error",
//       message: "No account found!",
//     };
//   }

//   const { confirmPassword } = validatedFields?.data;

//   const isOldPassword = await bcryptjs.compare(
//     confirmPassword,
//     isUserExists.password
//   );

//   if (isOldPassword) {
//     return {
//       success: false,
//       type: "error",
//       message: "Cannot use old passwords!",
//     };
//   }

//   const hashedPassword = await bcryptjs.hash(confirmPassword, 10);

//   await db.user.update({
//     where: {
//       id: isUserExists.id,
//     },
//     data: {
//       password: hashedPassword,
//       email: isUserExists.email,
//     },
//   });

//   await db.passwordResetToken.delete({
//     where: {
//       id: tokenFromDB.id,
//     },
//   });

//   return {
//     success: true,
//     type: "success",
//     message: "Congrats!!!. Your password has changed!",
//   };
// };

export const logout = async (sessionToken) => {
  // Retrieve the session from NextAuth

  const { user } = await auth();

  await deleteSession(sessionToken, user.id);

  // Sign out from NextAuth
  await signOut({
    redirectTo: "/",
  });
};

export const deleteUser = async (userId) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return {
        success: false,
        type: "error",
        message: "Account not found!",
      };
    }

    await signOut({
      redirect: false,
    });

    await db.user.delete({
      where: {
        id: user.id,
      },
    });

    return {
      success: true,
      type: "success",
      message: "Account deleted successfully!",
    };
  } catch (error) {
    console.log(error?.message);
    return {
      success: false,
      type: "error",
      message: "Something went wrong!",
    };
  }
};
