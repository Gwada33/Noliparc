"use client";

import { useState } from "react";
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
import { MuiTelInput } from "mui-tel-input";
import AuthShell from "@/components/AuthShell";

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
    <AuthShell title="Créez votre compte" subtitle="Inscrivez-vous en quelques secondes">
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <Box display="flex" gap={1.5}>
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

          <MuiTelInput
            defaultCountry="GP"
            preferredCountries={["FR", "BE", "CH", "GP"]}
            label="Numéro de téléphone"
            fullWidth
            required
            value={form.phone}
            onChange={(value: string) =>
              setForm((prev) => ({ ...prev, phone: value }))
            }
          />

          <div className="recaptcha-wrap">
            <ReCAPTCHA
              sitekey="6LdB4E0rAAAAAIVszAj02dyiKJnOmAyPKPB0eykR"
              onChange={(token) => setCaptchaToken(token)}
            />
          </div>

          <FormControlLabel
            control={
              <Checkbox
                checked={acceptedCGU}
                onChange={(e) => setAcceptedCGU(e.target.checked)}
                required
              />
            }
            label={
              <Typography variant="body2" component="span">
                J&apos;accepte les{" "}
                <Link href="/legal#cgu" target="_blank" underline="hover">
                  conditions d&apos;utilisation
                </Link>
                *
              </Typography>
            }
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "S'inscrire"}
          </Button>

          <Typography variant="body2" textAlign="center" mt={1}>
            Déjà un compte ? <Link href="/login">Connectez-vous</Link>
          </Typography>
        </Box>
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
    </AuthShell>
  );
}
