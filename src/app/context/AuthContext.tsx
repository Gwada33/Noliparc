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

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
   const router = useRouter();                     // ← initialise le routeur


  /* ------------------------------------------------------------------
   * Interroge /api/me pour savoir si un cookie `accessToken` est présent
   * ------------------------------------------------------------------ */
  async function fetchUser() {
    setLoading(true);
    const res = await fetch("/api/me"); // le cookie est envoyé automatiquement
    if (res.ok) {
      const { user } = (await res.json()) as { user: User };
      setUser(user);
    } else {
      setUser(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUser(); // au montage
  }, []);

  /* --------------------------- LOGIN -------------------------------- */
/* --------------------------- LOGIN -------------------------------- */
async function login(email: string, password: string) {
  setLoading(true);

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    setLoading(false);
    const { message } = await res.json();
    throw new Error(message || "Échec de la connexion");
  }

  await fetchUser();                    // met l'utilisateur dans le contexte                    // rafraîchit la page/app
}


  /* --------------------------- LOGOUT ------------------------------- */
  async function logout() {
    await fetch("/api/logout", { method: "POST" }); // efface le cookie côté serveur

    setUser(null);

    router.replace("/");    
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
