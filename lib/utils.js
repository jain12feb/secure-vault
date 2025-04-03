import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// // Secret key and initialization vector (IV) for AES encryption
// const ENCRYPTION_KEY = crypto.randomBytes(32); // 32 bytes key for AES-256
// const IV_LENGTH = 16; // AES block size (16 bytes)

// export function encryptPassword(password) {
//   const iv = crypto.randomBytes(IV_LENGTH); //Initialization Vector (IV)
//   const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv); 
//   let encrypted = cipher.update(password, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return `${iv.toString("hex")}:${encrypted}`; // Store IV with encrypted password
// }

// export function decryptPassword(encryptedPassword) {
//   const [ivHex, encrypted] = encryptedPassword.split(":");
//   const iv = Buffer.from(ivHex, "hex"); //Initialization Vector (IV)
//   const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
//   let decrypted = decipher.update(encrypted, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// }

export const generateStrongPassword = () => {
  // Lists of words by category
  const adjectives = [
    "Brave",
    "Clever",
    "Swift",
    "Mighty",
    "Vibrant",
    "Gentle",
    "Fierce",
    "Calm",
    "Bright",
    "Wise",
    "Silent",
    "Cosmic",
    "Radiant",
    "Mystic",
    "Eternal",
    "Noble",
    "Vivid",
    "Serene",
    "Daring",
  ];
  const nouns = [
    "Tiger",
    "Mountain",
    "Ocean",
    "Eagle",
    "Phoenix",
    "Dragon",
    "River",
    "Forest",
    "Thunder",
    "Diamond",
    "Castle",
    "Warrior",
    "Galaxy",
    "Falcon",
    "Volcano",
    "Crystal",
    "Horizon",
    "Tempest",
    "Oasis",
  ];
  const verbs = [
    "Jump",
    "Soar",
    "Dance",
    "Swim",
    "Climb",
    "Fly",
    "Run",
    "Dream",
    "Build",
    "Shine",
    "Explore",
    "Conquer",
    "Create",
    "Inspire",
    "Evolve",
    "Ignite",
    "Triumph",
    "Forge",
    "Transcend",
  ];

  // Special characters and numbers
  const specialChars = "!@#$%^&*()_+-=";
  const numbers = "0123456789";

  // Select random words
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];

  // Select random special characters and numbers
  const randomSpecial =
    specialChars[Math.floor(Math.random() * specialChars.length)] +
    specialChars[Math.floor(Math.random() * specialChars.length)];
  const randomNumbers =
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)];

  // Combine all elements with some randomization in the pattern
  let password;
  const pattern = Math.floor(Math.random() * 3);

  switch (pattern) {
    case 0:
      password = `${randomAdjective}${randomSpecial[0]}${randomNoun}${randomNumbers}`;
      break;
    case 1:
      password = `${randomNoun}${randomNumbers}${randomVerb}${randomSpecial[1]}`;
      break;
    case 2:
      password = `${randomSpecial[0]}${randomVerb}${randomAdjective}${randomNumbers}`;
      break;
  }

  // Add some character substitutions to increase complexity
  password = password
    .replace(/a/g, "@")
    .replace(/i/g, "1")
    .replace(/e/g, "3")
    .replace(/o/g, "0")
    .replace(/s/g, "$");

  return password;
};

// const generatePassword = () => {
    //   const length = 16;
    //   const charset =
    //     "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    //   let password = "";
  
    //   // Ensure at least one of each character type
    //   password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    //   password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    //   password += "0123456789"[Math.floor(Math.random() * 10)];
    //   password += "!@#$%^&*()_+~`|}{[]:;?><,./-="[Math.floor(Math.random() * 30)];
  
    //   // Fill the rest randomly
    //   for (let i = 4; i < length; i++) {
    //     password += charset[Math.floor(Math.random() * charset.length)];
    //   }
  
    //   // Shuffle the password
    //   password = password
    //     .split("")
    //     .sort(() => 0.5 - Math.random())
    //     .join("");
  
    //  return password
    // };

