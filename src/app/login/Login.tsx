"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, error: authError, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [shapes, setShapes] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const newShapes = [...Array(20)].map((_, i) => {
      const size = Math.floor(Math.random() * 150) + 50; // 50–200px
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = Math.random() * 10;

      return (
        <div
          key={i}
          className="pattern-shape-login"
          style={{
            width: size,
            height: size,
            top: `${top}%`,
            left: `${left}%`,
            animationDelay: `${delay}s`,
          }}
        />
      );
    });

    setShapes(newShapes);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await login(form.email, form.password);
      const next = searchParams.get("next") ?? "/";
      router.push(next);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Paper elevation={6} sx={{ padding: 4, width: "100%", background: 'none', boxShadow: 'none', maxWidth: 400 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Connexion
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input input-bordered"
            />

            <TextField
              label="Mot de passe"
              type="password"
              fullWidth
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input input-bordered"
            />

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
      </Paper>
  <div className="magicpattern-container">{shapes}</div>
    </Box>
  );
}