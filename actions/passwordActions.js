"use server";

import { encryptPassword, decryptPassword } from "@/lib/cryptoUtils";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function fetchUserPasswords(userId) {
  try {
    const passwords = await db.password.findMany({
      where: { userId },
      include: {
        category: true,
      },
    });

    return passwords;
  } catch (error) {
    console.error("Error fetching passwords:", error);
    throw new Error("Failed to fetch passwords");
  }
}

// Create a new password entry
export async function createPassword(requestBody) {
  try {
    const {
      user: { id: userId },
    } = await auth();
    const { categoryId, title, username, encryptedPassword, url, notes } =
      requestBody;

    // Encrypt the password
    // const encryptedPassword = encryptPassword(password);

    const passwordEntry = await db.password.create({
      data: {
        title,
        username,
        password: encryptedPassword,
        url: url || null,
        notes: notes || null,
        user: {
          connect: { id: userId },
        },
        category: {
          connect: { id: categoryId },
        },
        lastUsedAt: new Date(),
      },
    });

    return passwordEntry;
  } catch (error) {
    console.error("Error creating password entry:", error);
    throw new Error("Failed to create password entry");
  }
}

// Update an existing password entry
export async function updatePassword(passwordId, data) {
  try {
    const {
      user: { id: userId },
    } = await auth();
    const { title, username, encryptedPassword, url, notes, categoryId } = data;

    // Encrypt the password
    // const encryptedPassword = encryptPassword(password);

    const updatedPassword = await db.password.update({
      where: { id: passwordId },
      include: {
        category: true,
      },
      data: {
        title,
        username,
        password: encryptedPassword,
        url: url || null,
        notes: notes || null,
        updatedAt: new Date(),
        lastUsedAt: new Date(),
        category: {
          connect: { id: categoryId },
        },
      },
    });

    return updatedPassword;
  } catch (error) {
    console.error("Error updating password entry:", error);
    throw new Error("Failed to update password entry");
  }
}

// Delete a password entry
export async function deletePassword(passwordId) {
  try {
    const {
      user: { id: userId },
    } = await auth();
    const deletedPassword = await db.password.delete({
      where: { id: passwordId },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting password entry:", error);
    throw new Error("Failed to delete password entry");
  }
}

// Function to decrypt a specific password
export async function getDecryptedPassword(passwordId, userId) {
  if (!passwordId || !userId) {
    return { success: false, message: "Invalid password ID or user ID" };
  }
  try {
    const password = await db.password.findUnique({
      where: { id: passwordId },
    });

    if (!password || password.userId !== userId) {
      throw new Error("Password not found or unauthorized access");
    }

    // Decrypt the password
    const decryptedPassword = decryptPassword(password.password);

    const lastUsedAt = new Date();

    // Update lastUsedAt timestamp
    await db.password.update({
      where: { id: passwordId },
      data: { lastUsedAt },
    });

    return {
      success: true,
      decryptedPassword,
      lastUsedAt,
    };
  } catch (error) {
    console.error("Error decrypting password:", error);
    return {
      success: false,
      message: "Failed to decrypt password",
    };
  }
}
