import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cdn_subdomain: true,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadAvatarImage = async (avatarFile, public_id) => {
  try {
    const arrayBuffer = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({ folder: "avatars", public_id }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    console.log(uploadResult);

    // Optimize delivery by resizing and applying auto-format and auto-quality
    const optimizeUrl = cloudinary.url(public_id, {
      fetch_format: "auto",
      quality: "auto",
    });

    return optimizeUrl; // Return the optimized image URL
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new Error("Failed to upload avatar");
  }
};
