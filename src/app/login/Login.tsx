"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";
import AuthShell from "@/components/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const { login, error: authError, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await login(form.email, form.password);
      const next = searchParams.get("next") ?? "/";
      router.push(next);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <AuthShell title="Connexion" subtitle="Accédez à votre espace Noliparc">
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Box display="flex" justifyContent="flex-end">
            <Link href="/forgot-password" passHref>
              <Typography
                variant="body2"
                sx={{ color: "primary.main", cursor: "pointer", textDecoration: "none" }}
              >
                Mot de passe oublié ?
              </Typography>
            </Link>
          </Box>

          {authError && (
            <Typography color="error" align="center">
              {authError}
            </Typography>
          )}
          {authLoading && (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={authLoading}
            sx={{ mt: 2 }}
          >
            Connexion
          </Button>

          <Typography align="center" mt={2} fontSize={14}>
            Pas encore de compte ?{" "}
            <Link href="/register" passHref>
              <Typography
                component="span"
                sx={{ color: "primary.main", fontWeight: 600, cursor: "pointer" }}
              >
                Inscrivez-vous
              </Typography>
            </Link>
          </Typography>
        </Box>
      </form>
    </AuthShell>
  );
}
