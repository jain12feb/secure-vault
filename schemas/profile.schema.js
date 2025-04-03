import { UserRole } from "@prisma/client";
import * as z from "zod";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 5MB
const MIN_DIMENSIONS = { width: 200, height: 200 };
const MAX_DIMENSIONS = { width: 4096, height: 4096 };
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const ProfileSchema = z.object({
  name: z.string().min(1, { message: "Please enter a your name!" }),
  // email: z.string().email({
  //   message: "Please enter a valid email address.",
  // }),
  // isTwoFactorEnabled: z.optional(z.boolean()),
  // role: z.enum([UserRole.ADMIN, UserRole.USER]),
  bio: z.string().max(160).optional(),
});
