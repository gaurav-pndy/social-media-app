// This file defines the Authentication context for the whole app.

import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../services/supaBaseClient";
import {
  AuthResponse,
  SignUpCredentials,
  SignInCredentials,
  AuthContextProps,
  AuthProviderProps,
} from "../types/types";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This effect is used to fetch the current session and listen to changes in the auth state.

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setIsLoading(false);
    };

    // Subscribing to auth state changes (login/logout).

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    fetchSession();
    return () => subscription.unsubscribe();
  }, []);

  // This is a helper function to handle the errors arising during Authentication process.

  const handleError = (message: string) => {
    setError(message);
    throw new Error(message);
  };

  // This is the function to handle the Sign up for a new user.

  const signUp = async (credentials: SignUpCredentials) => {
    const { email, password, name, username } = credentials;

    if (!email || !password || !name || !username) {
      return handleError("One or more details are missing");
    }

    const { data, error } = await supabase.auth.signUp({ email, password }); // Signing up with Email and Password using Supabase Auth.
    if (error) return handleError(error.message);

    const user = data.user;
    if (user) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { name, username },
      }); // Updating the name and username of user in user_metadata for quick access later.

      if (updateError) return handleError(updateError.message);

      const { error: insertError } = await supabase.from("users").insert([
        {
          email: user.email,
          name,
          username,
        },
      ]); // Inserting the data of signed up user into the users table in database.

      if (insertError) return handleError(insertError.message);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData?.session)
        return handleError("Session fetch failed");

      setUser(sessionData.session.user);

      setError(null);
    }
  };

  // This is the function to handle the Sign in for an existing user.

  const signIn = async (credentials: SignInCredentials) => {
    const { email, password } = credentials;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    }); // Signing up with email and password using Supabase auth.
    if (error) return handleError(error.message);

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData?.session)
      return handleError("No session found");

    const session = sessionData.session;
    const user = session.user;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !userData) return handleError("User does not exist");

    setUser(user);
    setError(null);
  };

  // This is the function to handle the Sign out by user.

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut(); // Sign out using Supabase Auth.
      if (error) return handleError(error.message);

      setUser(null);
      setError(null);
    } catch {
      handleError("Sign-out failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, signUp, signIn, signOut, isLoading, error }}
    >
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export default AuthContext;
