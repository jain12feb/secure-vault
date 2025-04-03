"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
  fetchUserPasswords,
  createPassword,
  updatePassword,
  deletePassword,
  getDecryptedPassword,
} from "@/actions/passwordActions";
import { encryptPassword, decryptPassword } from "@/lib/cryptoUtils";
import { useToast } from "@/components/ui/use-toast";
import { useUserProfile } from "./UserProfileContext";
import { useRouter } from "next/navigation";
import zxcvbn from "zxcvbn";

// Create the context
const PasswordContext = createContext({
  passwords: [],
  setPasswords: () => {},
  isPasswordsLoading: true,
  isPasswordDeleting: false,
  isPasswordUpdating: false,
  setPasswordDeleting: () => {},
  setPasswordUpdating: () => {},
  addPassword: () => {},
  changePassword: () => {},
  removePassword: () => {},
  editingPassword: null,
  setEditingPassword: () => {},
  deletingPassword: null,
  setDeletingPassword: () => {},
  weakPasswordsCount: 0,
  passwordHealth: 100,
  weakPasswords: [],
});

const checkPasswordStrength = (password) => {
  const result = zxcvbn(password);
  return {
    score: result.score, // 0 (weak) to 4 (strong)
    feedback: result.feedback.suggestions,
  };
};
const calculatePasswordHealth = (passwords) => {
  if (passwords.length === 0) return 0; // If no passwords, assume good health

  const totalScore = passwords.reduce(
    (sum, pwd) =>
      sum + checkPasswordStrength(decryptPassword(pwd.password)).score,
    0
  );
  const averageScore = totalScore / passwords.length;

  // Convert score (0-4) into percentage (0-100)
  return Math.round((averageScore / 4) * 100);
};

// Create the provider component
export const PasswordProvider = ({ children }) => {
  const [passwords, setPasswords] = useState([]);
  const [isPasswordsLoading, setPasswordsLoading] = useState(true);
  const [isPasswordDeleting, setPasswordDeleting] = useState(false);
  const [isPasswordUpdating, setPasswordUpdating] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [deletingPassword, setDeletingPassword] = useState(null);
  const { toast } = useToast();
  const { user } = useUserProfile();
  const router = useRouter();

  // const { setRefreshNotification } = useNotification();

  const [weakPasswordsCount, setWeakPasswordsCount] = useState(0);
  const [passwordHealth, setPasswordHealth] = useState(100);
  const [weakPasswords, setWeakPasswords] = useState([]);

  // Load passwords initially
  const loadPasswords = async (userId) => {
    if (!userId) return;

    try {
      setPasswordsLoading(true);
      const fetchedPasswords = await fetchUserPasswords(userId);
      setPasswords(fetchedPasswords);
    } catch (error) {
      console.error("Error loading passwords:", error);
      toast({
        title: "Error",
        description: "Failed to load passwords.",
        variant: "destructive",
      });
    } finally {
      setPasswordsLoading(false);
    }
  };

  // Add a new password
  const addPassword = async (passwordData) => {
    try {
      // Encrypt sensitive data before storing
      const encryptedPassword = encryptPassword(passwordData.password);

      const newPassword = await createPassword({
        ...passwordData,
        encryptedPassword,
      });

      setPasswords((prev) => [...prev, newPassword]);

      toast({
        title: "Password saved",
        description: "Your password has been securely stored.",
      });

      router.push("/passwords");
    } catch (error) {
      console.error("Error adding password:", error);
      toast({
        variant: "destructive",
        title: "Error saving password",
        description: error?.message || "An error occurred",
      });
    }
  };

  // Update an existing password
  const changePassword = async (passwordData) => {
    const passwordId = editingPassword?.id;
    setPasswordUpdating(true);
    try {
      // Encrypt password before storing
      const encryptedPassword = encryptPassword(passwordData.password);

      const updatedPassword = await updatePassword(passwordId, {
        ...passwordData,
        encryptedPassword,
      });

      setPasswords((prev) =>
        prev.map((password) =>
          password.id === passwordId ? updatedPassword : password
        )
      );

      setEditingPassword(null);

      // setRefreshNotification(true);

      toast({
        title: "Password updated",
        description: "The password entry has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Password updation failed",
        description: error?.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setPasswordUpdating(false);
      // setRefreshNotification(false);
    }
  };

  // Delete a password
  const removePassword = async (passwordId) => {
    setPasswordDeleting(true);
    try {
      const result = await deletePassword(passwordId);

      if (result?.success) {
        setPasswords((prev) =>
          prev.filter((password) => password.id !== passwordId)
        );

        toast({
          title: "Password deleted",
          description: "The password entry has been deleted.",
        });

        setDeletingPassword(null);
      }

      return result;
    } catch (error) {
      console.error("Error deleting password:", error);
      // throw new Error(error.message || "Failed to delete password");
      toast({
        title: "Error deleting password",
        description: "Failed to delete password entry.",
        variant: "destructive",
      });
    } finally {
      setPasswordDeleting(false);
    }
  };

  // Calculate weak passwords whenever passwords change
  useEffect(() => {
    console.log("passwords", passwords);
    const decryptedPasswordsStrength = passwords.map((pwd) => ({
      ...pwd,
      strength: checkPasswordStrength(decryptPassword(pwd.password)),
    }));

    const weakPwdList = decryptedPasswordsStrength.filter(
      (pwd) => pwd.strength.score < 3
    );
    setWeakPasswords(weakPwdList);
    setWeakPasswordsCount(weakPwdList.length);

    // Calculate Password Health Score
    setPasswordHealth(calculatePasswordHealth(passwords));
  }, [passwords]);

  useEffect(() => {
    if (user?.id) {
      loadPasswords(user.id);
      
    }
  }, [user?.id]);

  // Context value
  const value = {
    passwords,
    setPasswords,
    isPasswordsLoading,
    isPasswordDeleting,
    isPasswordUpdating,
    setPasswordDeleting,
    addPassword,
    changePassword,
    removePassword,
    editingPassword,
    setEditingPassword,
    deletingPassword,
    setDeletingPassword,
    weakPasswordsCount,
    passwordHealth,
    weakPasswords,
  };

  return (
    <PasswordContext.Provider value={value}>
      {children}
    </PasswordContext.Provider>
  );
};

// Custom hook to use the password context
export function usePassword() {
  const context = useContext(PasswordContext);

  if (context === null) {
    throw new Error("usePassword must be used within a PasswordProvider");
  }

  return context;
}
