"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Session {
  user?: User | null;
}

export function useCurrentUser() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();

        setSession(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching session:", error);
        setLoading(false);
      }
    }

    fetchSession();
  }, []);

  return {
    session,
    user: session?.user || null,
    loading,
  };
}
