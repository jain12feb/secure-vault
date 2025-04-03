"use server";

import { currentUser } from "@/lib/auth";
import { getUserByEmail, getUserById } from "../data/user";
import { db } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { ProfileSchema } from "@/schemas/profile.schema";
import { UpdatePasswordSchema } from "@/schemas/update-password.schema";
import { UserRole } from "@prisma/client";
import { getAllSessions } from "@/actions/session-actions";
import { uploadAvatarImage } from "@/data/cloudinary";

// 1. **Update Profile**
export const updateProfile = async (values) => {
  const validatedData = ProfileSchema.safeParse(values);

  if (!validatedData?.success) {
    return {
      success: false,
      type: "error",
      message: "Please fill all the fields!",
    };
  }

  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      type: "error",
      message: "Unauthorized",
    };
  }

  const userFromDB = await getUserById(user.id);

  if (!userFromDB) {
    return {
      success: false,
      type: "error",
      message: "No account found!",
    };
  }

  if (user.isOAuth) {
    validatedData.data.email = undefined;
    validatedData.data.isTwoFactorEnabled = undefined;
  }

  if (
    validatedData.data.email &&
    validatedData.data.email !== userFromDB.email
  ) {
    const isEmailAlreadyExists = await getUserByEmail(validatedData.data.email);

    if (isEmailAlreadyExists && isEmailAlreadyExists.id !== user.id) {
      return {
        success: false,
        type: "error",
        message: "Email already exists!",
      };
    }

    const verificationToken = await generateVerificationToken(
      validatedData.data.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: true,
      type: "success",
      message: "Verification email sent!",
      hasEmailVerificationToken: true,
    };
  }

  // Handle avatar upload if a new file is provided
  // if (values.image instanceof File) {
  //   try {
  //     const publicId = `avatar_${user.id}`; // Unique ID for Cloudinary
  //     const avatarUrl = await uploadAvatarImage(values.image, publicId);
  //     validatedData.data.image = avatarUrl; // Save the Cloudinary URL in the `image` field
  //   } catch (error) {
  //     return {
  //       success: false,
  //       type: "error",
  //       message: "Failed to upload avatar!",
  //     };
  //   }
  // }

  // Update user profile
  await db.user.update({
    where: { id: userFromDB.id },
    data: { ...validatedData.data },
  });

  return {
    success: true,
    type: "success",
    message: "Profile Updated Successfully",
  };
};

// 2. **Change Password**
export const changePassword = async (values) => {
  const isEmpty = Object.values(values).some(
    (v) => v === "" || v === null || v === undefined
  );
  if (isEmpty) {
    return {
      success: false,
      type: "error",
      message: "Please fill all the fields!",
    };
  }
  const validatedData = UpdatePasswordSchema.safeParse(values);

  if (!validatedData?.success) {
    return {
      success: false,
      type: "error",
      message: validatedData?.error.issues[0].message,
    };
  }

  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      type: "error",
      message: "Unauthorized",
    };
  }

  const userFromDB = await getUserById(user.id);

  if (!userFromDB) {
    return {
      success: false,
      type: "error",
      message: "No account found!",
    };
  }

  if (user.isOAuth) {
    validatedData.oldPassword = undefined;
    validatedData.confirmPassword = undefined;
  }

  const { oldPassword, confirmPassword } = validatedData.data;

  if (oldPassword && confirmPassword && userFromDB.password) {
    const isPasswordMatched = await bcryptjs.compare(
      oldPassword,
      userFromDB.password
    );

    if (!isPasswordMatched) {
      return {
        success: false,
        type: "error",
        message: "Old password is incorrect!",
      };
    }
  }

  const hashedPassword = await bcryptjs.hash(confirmPassword, 10);

  await db.user.update({
    where: { id: userFromDB.id },
    data: { password: hashedPassword },
  });

  return {
    success: true,
    type: "success",
    message: "Password Updated Successfully",
  };
};

// 3. **Verify Email**
export const verifyEmail = async (email) => {
  const userFromDB = await getUserByEmail(email);

  if (!userFromDB) {
    return {
      success: false,
      type: "error",
      message: "No account found with this email!",
    };
  }

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return {
    success: true,
    type: "success",
    message: "Verification email sent!",
  };
};

// 4. **Update Avatar**
// export const updateAvatar = async (avatarFile) => {
//   const user = await currentUser();

//   if (!user) {
//     return {
//       success: false,
//       type: "error",
//       message: "Unauthorized",
//     };
//   }

//   const userFromDB = await getUserById(user.id);

//   if (!userFromDB) {
//     return {
//       success: false,
//       type: "error",
//       message: "No account found!",
//     };
//   }

//   // Assuming uploadAvatarImage returns the URL of the uploaded avatar
//   const avatarUrl = await uploadAvatarImage(avatarFile);

//   await db.user.update({
//     where: { id: userFromDB.id },
//     data: { avatarUrl },
//   });

//   return {
//     success: true,
//     type: "success",
//     message: "Avatar Updated Successfully",
//   };
// };

// 5. **Enable/Disable Two-Factor Authentication**
// export const toggleTwoFactorAuth = async (enable) => {
//   const user = await currentUser();

//   if (!user) {
//     return {
//       success: false,
//       type: "error",
//       message: "Unauthorized",
//     };
//   }

//   const userFromDB = await getUserById(user.id);

//   if (!userFromDB) {
//     return {
//       success: false,
//       type: "error",
//       message: "No account found!",
//     };
//   }

//   if (enable) {
//     const twoFactorData = await enableTwoFactorAuth(userFromDB.id);
//     await db.user.update({
//       where: { id: userFromDB.id },
//       data: { isTwoFactorEnabled: true, twoFactorSecret: twoFactorData.secret },
//     });

//     return {
//       success: true,
//       type: "success",
//       message: "Two-Factor Authentication enabled successfully!",
//     };
//   } else {
//     await disableTwoFactorAuth(userFromDB.id);
//     await db.user.update({
//       where: { id: userFromDB.id },
//       data: { isTwoFactorEnabled: false, twoFactorSecret: null },
//     });

//     return {
//       success: true,
//       type: "success",
//       message: "Two-Factor Authentication disabled successfully!",
//     };
//   }
// };

export const toggleTwoFactorAuth = async () => {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      type: "error",
      message: "Unauthorized",
    };
  }

  const userFromDB = await getUserById(user.id);

  if (!userFromDB) {
    return {
      success: false,
      type: "error",
      message: "No account found!",
    };
  }

  await db.user.update({
    where: { id: userFromDB.id },
    data: { isTwoFactorEnabled: !userFromDB.isTwoFactorEnabled },
  });

  return {
    success: true,
    type: "success",
    message: `Two-Factor Authentication ${
      userFromDB.isTwoFactorEnabled ? "disabled" : "enabled"
    } successfully!`,
  };
};

// 6. **Fetch Profile Data**
export const fetchProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      type: "error",
      message: "Unauthorized",
    };
  }

  const userFromDB = await getUserById(user.id);

  if (!userFromDB) {
    return {
      success: false,
      type: "error",
      message: "No account found!",
    };
  }

  return {
    success: true,
    type: "success",
    data: userFromDB,
  };
};

// 7. **Change User Role (USER/ADMIN)**
export const changeUserRole = async (userId, newRole) => {
  // Validate if the new role is either 'USER' or 'ADMIN'
  if (![UserRole.USER, UserRole.ADMIN].includes(newRole)) {
    return {
      success: false,
      type: "error",
      message: "Invalid role provided!",
    };
  }

  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      type: "error",
      message: "Unauthorized",
    };
  }

  // Check if the logged-in user is an admin
  if (user.role !== UserRole.ADMIN) {
    return {
      success: false,
      type: "error",
      message: "You do not have permission to change user roles!",
    };
  }

  // Fetch the user from the DB using the userId passed in
  const userFromDB = await getUserById(userId);

  if (!userFromDB) {
    return {
      success: false,
      type: "error",
      message: "User not found!",
    };
  }

  // Check if the user is trying to change their own role
  if (user.id === userFromDB.id) {
    return {
      success: false,
      type: "error",
      message: "You cannot change your own role!",
    };
  }

  // Update the user's role in the database
  await db.user.update({
    where: { id: userFromDB.id },
    data: {
      role: newRole,
    },
  });

  return {
    success: true,
    type: "success",
    message: `User role updated to ${newRole}`,
  };
};

// 8. **Fetch All Sessions**
export const fetchSessions = async () => {
  const user = await currentUser();

  if (!user) {
    return {
      success: false,
      type: "error",
      message: "Unauthorized",
    };
  }

  const sessions = await getAllSessions(user.id);

  return {
    success: true,
    type: "success",
    data: sessions,
  };
};
