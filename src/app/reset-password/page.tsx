"use client";

import { useState, useEffect, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [shapes, setShapes] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!token) {
      setError("Lien invalide ou manquant.");
    }

    const newShapes = [...Array(20)].map((_, i) => {
      const size = Math.floor(Math.random() * 150) + 50;
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
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: "100%",
          background: "none",
          boxShadow: "none",
          maxWidth: 400,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Nouveau mot de passe
        </Typography>

        {success ? (
          <Box textAlign="center">
            <Alert severity="success" sx={{ mb: 2 }}>
              Mot de passe mis à jour avec succès ! Vous allez être redirigé vers la page de connexion.
            </Alert>
            <Link href="/login" passHref>
              <Button variant="contained" fullWidth>
                Aller à la connexion
              </Button>
            </Link>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Nouveau mot de passe"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered"
                disabled={!!error && !token}
              />
              <TextField
                label="Confirmer le mot de passe"
                type="password"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered"
                disabled={!!error && !token}
              />

              {error && (
                <Typography color="error" align="center">
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || (!!error && !token)}
                sx={{ mt: 1 }}
              >
                {loading ? <CircularProgress size={24} /> : "Changer le mot de passe"}
              </Button>

              <Link href="/login" passHref>
                <Button variant="text" fullWidth sx={{ mt: 1 }}>
                  Annuler
                </Button>
              </Link>
            </Box>
          </form>
        )}
      </Paper>
      <div className="magicpattern-container">{shapes}</div>
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
