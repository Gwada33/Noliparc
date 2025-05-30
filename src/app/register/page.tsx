"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { MuiTelInput } from 'mui-tel-input'

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [acceptedCGU, setAcceptedCGU] = useState(false);
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
          className="pattern-shape"
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

    const handlePhoneChange = (value: string) => {
    setForm({ ...form, phone: value });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!captchaToken) {
      setError("Veuillez valider le Captcha.");
      return;
    }

    if (!acceptedCGU) {
      setError("Veuillez accepter les conditions d'utilisation.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captcha: captchaToken }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(
          "Inscription réussie ! Vous pouvez maintenant vous connecter."
        );
        setTimeout(() => (window.location.href = "/login"), 1500);
      } else {
        setError(data.message || "Erreur lors de l’inscription");
      }
    } catch (err) {
      setError("Erreur réseau, veuillez réessayer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Box
        sx={{
          maxWidth: 500,
          padding: "1rem 1rem",
          borderRadius: "20px",
          maxHeight: "100vh",
          mx: "auto",
          mt: 10,
        }}
      >
        <Typography variant="h3" color="black" gutterBottom>
          Créez votre compte
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box display="flex" gap={2} mt={2}>
            <TextField
              label="Prénom"
              fullWidth
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />

            <TextField
              label="Nom"
              fullWidth
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </Box>

          <TextField
            label="Adresse email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            required
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

           <MuiTelInput
          defaultCountry="GP"
          preferredCountries={["FR", "BE", "CH", "GP"]}
          label="Numéro de téléphone"
          fullWidth
          required
          margin="normal"
          value={form.phone}
          onChange={(value: string) =>
            setForm((prev) => ({ ...prev, phone: value }))
          }
        />

          <Box mt={2}>
            <ReCAPTCHA
              sitekey="6LdB4E0rAAAAAIVszAj02dyiKJnOmAyPKPB0eykR"
              onChange={(token) => setCaptchaToken(token)}
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={acceptedCGU}
                onChange={(e) => setAcceptedCGU(e.target.checked)}
                required
              />
            }
            label={
              <Box display="inline" component="span">
                <Typography variant="body2" component="span" color="black">
                  J'accepte les{" "}
                  <Link href="/legal#cgu" target="_blank" underline="hover">
                    conditions d'utilisation
                  </Link>
                  <Typography component="span" color="error" sx={{ ml: 0 }}>
                    *
                  </Typography>
                </Typography>
              </Box>
            }
            sx={{ mt: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "S’inscrire"}
          </Button>

          <Typography variant="body2" textAlign="center" color="#000" mt={2}>
            Déjà un compte ? <Link href="/login">Connectez-vous</Link>
          </Typography>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Box>
      <div className="magicpattern-container">{shapes}</div>
    </>
  );
}
