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
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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


  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        const next = searchParams.get("next") ?? "/";
        window.location.href = (next);
      } else {
        setError(data.message || "Identifiants incorrects");
      }
    } catch {
      setError("Erreur réseau, veuillez réessayer");
    } finally {
      setLoading(false);
    }
  }

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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Se connecter"}
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

            {error && (
              <Typography color="error" align="center" fontSize={14}>
                {error}
              </Typography>
            )}
          </Box>
        </form>
      </Paper>
  <div className="magicpattern-container">{shapes}</div>
    </Box>
  );
}
