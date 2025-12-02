"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [shapes, setShapes] = useState<React.ReactNode[]>([]);

  useEffect(() => {
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
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      setSuccess(true);
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
          Mot de passe oublié
        </Typography>
        
        <Typography variant="body2" align="center" sx={{ mb: 3 }}>
          Entrez votre email pour recevoir un lien de réinitialisation.
        </Typography>

        {success ? (
          <Box textAlign="center">
            <Alert severity="success" sx={{ mb: 2 }}>
              Un email de réinitialisation a été envoyé si l'adresse existe.
            </Alert>
            <Link href="/login" passHref>
              <Button variant="contained" fullWidth>
                Retour à la connexion
              </Button>
            </Link>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered"
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
                disabled={loading}
                sx={{ mt: 1 }}
              >
                {loading ? <CircularProgress size={24} /> : "Envoyer le lien"}
              </Button>

              <Link href="/login" passHref>
                <Button variant="text" fullWidth sx={{ mt: 1 }}>
                  Retour à la connexion
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
