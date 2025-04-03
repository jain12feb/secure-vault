// utils/cryptoUtils.js
import CryptoJS from 'crypto-js';

// Use a secure server-side key from environment variables
const SECRET_KEY = "your-secret-key" || process.env.ENCRYPTION_SECRET_KEY;

// Encrypt password function
export const encryptPassword = (password) => {
  // Generate a random IV (Initialization Vector)
  const iv = CryptoJS.lib.WordArray.random(16);
  
  // Encrypt the password using AES-256-CBC
  const encrypted = CryptoJS.AES.encrypt(password, SECRET_KEY, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return iv.toString(CryptoJS.enc.Hex) + ':' + encrypted.toString();
};

// Decrypt password function
export const decryptPassword = (encryptedData) => {
  try {
    const [ivHex, encryptedText] = encryptedData.split(':');
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    
    const decrypted = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
