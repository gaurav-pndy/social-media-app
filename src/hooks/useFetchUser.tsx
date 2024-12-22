// This is a custom hook used to fetch the data of logged in user from users table in database.

import { useState, useEffect } from "react";
import { supabase } from "../services/supaBaseClient";

interface UserData {
  dp_url: string | null;
  name: string;
  username: string;
  email: string;
}

export const useFetchUser = (userId: string | undefined) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("uid", userId)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        console.error(fetchError);
      } else {
        setUserData(data);
      }

      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  return { userData, loading, error };
};
