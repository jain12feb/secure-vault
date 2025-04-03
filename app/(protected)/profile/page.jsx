import { fetchProfile } from "@/actions/profile-actions";
import ErrorCard from "@/components/auth/ErrorCard";
import ProfilePage from "@/components/dashboard/ProfilePage";
import React from "react";

const page = async () => {
  // try {
  //   const response = await fetchProfile();
  //   if (response.success) return <ProfilePage user={response.data} />;
  //   else return <ErrorCard />;
  // } catch (error) {
  //   console.error(error);
  //   return <ErrorCard />;
  // }
  return <ProfilePage />; // Placeholder for user data
};

export default page;
