// This is a custom hook to check if user is authenticated and then fetch details of the logged in user from the Supabase Authentication system.

import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
