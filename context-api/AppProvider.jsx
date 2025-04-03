"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { FadeLoader } from "react-spinners";
import zxcvbn from "zxcvbn";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Import actions
import {
  fetchProfile,
  updateProfile,
  toggleTwoFactorAuth,
  changeUserRole,
  fetchSessions,
} from "@/actions/profile-actions";
import { deleteUser } from "@/actions";
import {
  createCategory,
  deleteCategory,
  fetchUserCategories,
  updateCategory,
} from "@/actions/categoryActions";
import {
  fetchUserPasswords,
  createPassword,
  updatePassword,
  deletePassword,
  getDecryptedPassword,
} from "@/actions/passwordActions";

// Import utils
import { encryptPassword, decryptPassword } from "@/lib/cryptoUtils";

// Create the main context with default values
const AppContext = createContext({
  // User Profile defaults
  user: null,
  setUser: () => {},
  sessions: [],
  currentSession: null,
  isUserLoading: false,
  updateProfileData: () => {},
  toggleTwoFactor: () => {},
  deleteUserAccount: () => {},
  updateUserRole: () => {},

  // Categories defaults
  categories: [],
  isCategoriesLoading: true,
  isDialogOpen: false,
  setIsDialogOpen: () => {},
  editingCategory: null,
  setEditingCategory: () => {},
  isCategoryUpdating: false,
  setCategoryUpdating: () => {},
  addOrUpdateCategory: () => {},
  removeCategory: () => {},

  // Passwords defaults
  passwords: [],
  isPasswordsLoading: true,
  isPasswordDeleting: false,
  isPasswordUpdating: false,
  editingPassword: null,
  setEditingPassword: () => {},
  deletingPassword: null,
  setDeletingPassword: () => {},
  addPassword: () => {},
  changePassword: () => {},
  removePassword: () => {},
  weakPasswordsCount: 0,
  passwordHealth: 100,
  weakPasswords: [],

  // Master Key defaults
  // masterKey: null,
  // setMasterPassword: () => {},
  // clearMasterKey: () => {},

  // Sidebar Layout defaults
  isSidebarOpen: true,
  sidebarLayout: "sidebar",
  defaultOpen: false,
  toggleSidebar: () => {},
  changeSidebarLayout: () => {},
});

// Password strength utilities
const checkPasswordStrength = (password) => {
  const result = zxcvbn(password);
  return {
    score: result.score, // 0 (weak) to 4 (strong)
    feedback: result.feedback.suggestions,
  };
};

const calculatePasswordHealth = (passwords) => {
  if (passwords.length === 0) return 0;
  const totalScore = passwords.reduce(
    (sum, pwd) =>
      sum + checkPasswordStrength(decryptPassword(pwd.password)).score,
    0
  );
  const averageScore = totalScore / passwords.length;
  return Math.round((averageScore / 4) * 100);
};

// Main provider component
export function AppProvider({ children }) {
  const { toast } = useToast();
  const router = useRouter();
  const sessionUser = useCurrentUser();

  // ===== User Profile State =====
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState("");
  const [isUserLoading, setIsUserLoading] = useState(false);

  // ===== Category State =====
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setCategoriesLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCategoryUpdating, setCategoryUpdating] = useState(false);

  // ===== Password State =====
  const [passwords, setPasswords] = useState([]);
  const [isPasswordsLoading, setPasswordsLoading] = useState(true);
  const [isPasswordDeleting, setPasswordDeleting] = useState(false);
  const [isPasswordUpdating, setPasswordUpdating] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [deletingPassword, setDeletingPassword] = useState(null);
  const [weakPasswordsCount, setWeakPasswordsCount] = useState(0);
  const [passwordHealth, setPasswordHealth] = useState(100);
  const [weakPasswords, setWeakPasswords] = useState([]);

  // ===== Master Key State =====
  // const [masterKey, setMasterKey] = useState(null);

  // ===== Sidebar Layout State =====
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarLayout, setSidebarLayout] = useState("sidebar");
  const [defaultOpen, setDefaultOpen] = useState(false);

  // ===== Initialize Sidebar Layout =====
  useEffect(() => {
    const storedOpen = Cookies.get("sidebar:state") === "true";
    const storedLayout =
      window.localStorage.getItem("sidebar:layout") || "sidebar";
    setDefaultOpen(storedOpen);
    setSidebarLayout(storedLayout);
  }, []);

  // ===== Initialize Master Key =====
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = sessionStorage.getItem("masterKey");
      if (storedKey) {
        setMasterKey(storedKey);
      }
    }
  }, []);

  // ===== Initialize User Profile =====
  useEffect(() => {
    const loadProfile = async () => {
      setIsUserLoading(true);
      try {
        const response = await fetchProfile();
        if (response.success) {
          setUser(response.data);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.message,
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "An error occurred",
        });
      } finally {
        setIsUserLoading(false);
      }
    };

    const fetchSession = async () => {
      const response = await fetchSessions();
      if (response.success) {
        setSessions(response.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message,
        });
      }
    };

    loadProfile();
    fetchSession();
    setCurrentSession(sessionUser?.sessionToken);
  }, []);

  // ===== Load Categories =====
  useEffect(() => {
    if (user?.id) {
      loadCategories(user.id);
    }
  }, [user?.id]);

  // ===== Load Passwords =====
  useEffect(() => {
    if (user?.id) {
      loadPasswords(user.id);
    }
  }, [user?.id]);

  // ===== Calculate Password Health =====
  useEffect(() => {
    const decryptedPasswordsStrength = passwords.map((pwd) => ({
      ...pwd,
      strength: checkPasswordStrength(decryptPassword(pwd.password)),
    }));

    const weakPwdList = decryptedPasswordsStrength.filter(
      (pwd) => pwd.strength.score < 3
    );

    setWeakPasswords(weakPwdList);
    setWeakPasswordsCount(weakPwdList.length);
    setPasswordHealth(calculatePasswordHealth(passwords));
  }, [passwords]);

  // ===== User Profile Methods =====
  const updateProfileData = async (data) => {
    try {
      const result = await updateProfile(data);
      if (result?.hasEmailVerificationToken) {
        toast({
          title: "Email verification required",
          description: "Please verify your email address to proceed",
        });
      } else {
        if (result.success) {
          setUser((prev) => (prev ? { ...prev, ...data } : prev));
        }
        toast({
          variant: result.success ? "success" : "destructive",
          title: result.success ? "Profile updated" : "Profile update failed",
          description: result.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred",
      });
    }
  };

  const toggleTwoFactor = async () => {
    if (!user) return;
    try {
      const result = await toggleTwoFactorAuth();
      result.success &&
        setUser((prev) =>
          prev
            ? { ...prev, isTwoFactorEnabled: !prev.isTwoFactorEnabled }
            : prev
        );
      toast({
        variant: result.success ? "success" : "destructive",
        title: result.success
          ? "Two-factor Authentication updated"
          : "Failed to update Two-factor Authentication",
        description: result.message,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred",
      });
    }
  };

  const deleteUserAccount = async () => {
    if (!user) return;
    try {
      const result = await deleteUser(user.id);
      toast({
        variant: result.success ? "success" : "destructive",
        title: result.success ? "Account deleted" : "Account deletion failed",
        description: result.message,
      });
      if (result.success) {
        setUser(null);
        router.push("/");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred",
      });
    }
  };

  const updateUserRole = async (newRole) => {
    try {
      const result = await changeUserRole(user.id, newRole);
      result.success &&
        setUser((prev) => (prev ? { ...prev, role: newRole } : prev));
      toast({
        variant: result.success ? "success" : "destructive",
        title: result.success
          ? `Role changed to ${newRole}`
          : "Role change failed",
        description: result.message,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred",
      });
    }
  };

  // ===== Category Methods =====
  const loadCategories = async (userId) => {
    if (!userId) return;
    try {
      setCategoriesLoading(true);
      const fetchedCategories = await fetchUserCategories(userId);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive",
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  const addOrUpdateCategory = async (categoryData) => {
    setCategoryUpdating(true);
    try {
      if (editingCategory) {
        // Update category
        const updatedCategory = await updateCategory(
          editingCategory.id,
          categoryData.name,
          categoryData.description
        );
        setCategories(
          categories.map((cat) =>
            cat.id === editingCategory.id ? { ...updatedCategory } : cat
          )
        );
        toast({
          title: "Category updated",
          description: `Category "${editingCategory.name}" has been updated.`,
        });
      } else {
        // Add category
        const newCategory = {
          name: categoryData.name,
          description: categoryData.description,
        };
        const addedCategory = await createCategory(
          user?.id,
          newCategory.name,
          newCategory.description
        );
        setCategories([...categories, addedCategory]);
        toast({
          title: "Category added",
          description: `New category "${categoryData.name}" has been added.`,
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.log("Error adding or updating category:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to add or update category.",
        variant: "destructive",
      });
    } finally {
      setCategoryUpdating(false);
    }
  };

  const removeCategory = async (categoryId) => {
    try {
      const isCategoryDeleted = await deleteCategory(categoryId);
      if (isCategoryDeleted?.success) {
        setCategories(categories.filter((cat) => cat.id !== categoryId));
        toast({
          title: "Category deleted",
          description: "The category has been deleted.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete category.",
        variant: "destructive",
      });
    }
  };

  // ===== Password Methods =====
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

  const addPassword = async (passwordData) => {
    try {
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

  const changePassword = async (passwordData) => {
    const passwordId = editingPassword?.id;
    setPasswordUpdating(true);
    try {
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
    }
  };

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
      toast({
        title: "Error deleting password",
        description: "Failed to delete password entry.",
        variant: "destructive",
      });
    } finally {
      setPasswordDeleting(false);
    }
  };

  // ===== Master Key Methods =====
  // const setMasterPassword = (password, salt = "your-app-salt") => {
  //   const derivedKey = deriveEncryptionKey(password, salt);
  //   const keyString = derivedKey.toString();
  //   sessionStorage.setItem("masterKey", keyString);
  //   setMasterKey(keyString);
  //   return keyString;
  // };

  // const clearMasterKey = () => {
  //   sessionStorage.removeItem("masterKey");
  //   setMasterKey(null);
  // };

  // ===== Sidebar Methods =====
  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    Cookies.set("sidebar:state", String(newState));
  };

  const changeSidebarLayout = (layout) => {
    setSidebarLayout(layout);
    window.localStorage.setItem("sidebar:layout", layout);
  };

  // Create the context value object
  const contextValue = {
    // User Profile
    user,
    setUser,
    sessions,
    currentSession,
    isUserLoading,
    updateProfileData,
    toggleTwoFactor,
    deleteUserAccount,
    updateUserRole,

    // Categories
    categories,
    isCategoriesLoading,
    isDialogOpen,
    setIsDialogOpen,
    editingCategory,
    setEditingCategory,
    isCategoryUpdating,
    setCategoryUpdating,
    addOrUpdateCategory,
    removeCategory,

    // Passwords
    passwords,
    isPasswordsLoading,
    isPasswordDeleting,
    isPasswordUpdating,
    editingPassword,
    setEditingPassword,
    deletingPassword,
    setDeletingPassword,
    addPassword,
    changePassword,
    removePassword,
    weakPasswordsCount,
    passwordHealth,
    weakPasswords,

    // Master Key
    // masterKey,
    // setMasterPassword,
    // clearMasterKey,

    // Sidebar Layout
    isSidebarOpen,
    sidebarLayout,
    defaultOpen,
    toggleSidebar,
    changeSidebarLayout,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Custom hooks for accessing specific parts of the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Specific hooks for different parts of the app
export function useUserProfile() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useUserProfile must be used within an AppProvider");
  }

  return {
    user: context.user,
    setUser: context.setUser,
    sessions: context.sessions,
    currentSession: context.currentSession,
    isUserLoading: context.isUserLoading,
    updateProfileData: context.updateProfileData,
    toggleTwoFactor: context.toggleTwoFactor,
    deleteUserAccount: context.deleteUserAccount,
    updateUserRole: context.updateUserRole,
  };
}

export function useCategory() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useCategory must be used within an AppProvider");
  }

  return {
    categories: context.categories,
    isCategoriesLoading: context.isCategoriesLoading,
    isDialogOpen: context.isDialogOpen,
    setIsDialogOpen: context.setIsDialogOpen,
    editingCategory: context.editingCategory,
    setEditingCategory: context.setEditingCategory,
    isCategoryUpdating: context.isCategoryUpdating,
    setCategoryUpdating: context.setCategoryUpdating,
    addOrUpdateCategory: context.addOrUpdateCategory,
    removeCategory: context.removeCategory,
  };
}

export function usePassword() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("usePassword must be used within an AppProvider");
  }

  return {
    passwords: context.passwords,
    isPasswordsLoading: context.isPasswordsLoading,
    isPasswordDeleting: context.isPasswordDeleting,
    isPasswordUpdating: context.isPasswordUpdating,
    editingPassword: context.editingPassword,
    setEditingPassword: context.setEditingPassword,
    deletingPassword: context.deletingPassword,
    setDeletingPassword: context.setDeletingPassword,
    addPassword: context.addPassword,
    changePassword: context.changePassword,
    removePassword: context.removePassword,
    weakPasswordsCount: context.weakPasswordsCount,
    passwordHealth: context.passwordHealth,
    weakPasswords: context.weakPasswords,
  };
}

// export function useMasterKey() {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error("useMasterKey must be used within an AppProvider");
//   }

//   return {
//     masterKey: context.masterKey,
//     setMasterPassword: context.setMasterPassword,
//     clearMasterKey: context.clearMasterKey,
//   };
// }

export function useSidebarLayout() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useSidebarLayout must be used within an AppProvider");
  }

  return {
    isSidebarOpen: context.isSidebarOpen,
    sidebarLayout: context.sidebarLayout,
    defaultOpen: context.defaultOpen,
    toggleSidebar: context.toggleSidebar,
    changeSidebarLayout: context.changeSidebarLayout,
  };
}
