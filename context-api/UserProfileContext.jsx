"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchProfile,
  updateProfile,
  toggleTwoFactorAuth,
  changeUserRole,
  fetchSessions,
} from "@/actions/profile-actions";
import { useToast } from "@/components/ui/use-toast";
import { deleteUser } from "@/actions";
import { FadeLoader } from "react-spinners";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Define the shape of the user profile data
// interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   bio: string;
//   isTwoFactorEnabled: boolean;
//   role: "USER" | "ADMIN";
// }

// Define the context data shape
// interface UserProfileContextType {
//   user: UserProfile | null;
//   isLoading: boolean;
//   updateProfileData: (data: UserProfile) => Promise<void>;
//   toggleTwoFactor: () => Promise<void>;
//   deleteUserAccount: () => Promise<void>;
// }

// Create the context with a default value
const UserProfileContext = createContext({
  user: null,
  sessions: [],
  currentSession: null,
  setUser: () => {},
  updateProfileData: () => {},
  toggleTwoFactor: () => {},
  deleteUserAccount: () => {},
  updateUserRole: () => {},
});

export const UserProfileProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const sessionUser = useCurrentUser();

  // Fetch user profile data on initial render
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetchProfile();
        if (response.success) {
          setUser(response.data); // user also includes sessions array
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
        setIsLoading(false);
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
    setCurrentSession(sessionUser.sessionToken);
  }, []);

  const updateProfileData = async (data) => {
    // setIsLoading(true);
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
    } finally {
      // setIsLoading(false);
    }
  };

  const toggleTwoFactor = async () => {
    if (!user) return;
    // setIsLoading(true);
    try {
      const result = await toggleTwoFactorAuth();
      // const result = {
      //   success: false,
      //   message: "Bhari Mistake",
      //   // data: result.data,
      // }
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
    } finally {
      // setIsLoading(false);
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
    // setIsLoading(true);
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
    } finally {
      // setIsLoading(false);
    }
  };

  if (!user && isLoading) return <Loading />;
  else
    return (
      <UserProfileContext.Provider
        value={{
          user,
          sessions,
          currentSession,
          setUser,
          updateProfileData,
          toggleTwoFactor,
          deleteUserAccount,
          updateUserRole,
        }}
      >
        {children}
      </UserProfileContext.Provider>
    );
};

// Custom hook to use the UserProfileContext
export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
