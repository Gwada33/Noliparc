// src/context/AuthContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation"; 

export type UserRole = 'admin' | 'user';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [cache, setCache] = useState<{ [key: string]: User | null }>({});

  // Function to get user data from cache or fetch
  const getUser = async (): Promise<User | null> => {
    if (cache['user'] !== undefined) {
      return cache['user'];
    }
    
    try {
      const res = await fetch("/api/me");
      if (!res.ok) {
        setCache({ user: null });
        return null;
      }
      
      const { user } = await res.json();
      setCache({ user });
      return user;
    } catch (err) {
      console.error('Error fetching user:', err);
      setCache({ user: null });
      return null;
    }
  };

  // Initial fetch
  useEffect(() => {
    const initialize = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  // Optimized login function
  const login = async (email: string, password: string, loginUrl: string = '/api/auth/login'): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Échec de la connexion");
      }

      // Get user data directly from response instead of calling fetchUser
      const { user } = await res.json();
      setUser(user);
      setCache({ user });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      throw err;
    } finally {
      setLoading(false);
    }
  };


  /* --------------------------- LOGOUT ------------------------------- */
  async function logout() {
    await fetch("/api/logout", { method: "POST" }); // efface le cookie côté serveur

    setUser(null);

    router.replace("/");    
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'AuthProvider");
  }
  return ctx;
}
