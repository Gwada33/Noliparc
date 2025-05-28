"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      await emailjs.send(
        "service_xxxxxx", // Replace with your EmailJS service ID
        "template_xxxxxx", // Replace with your EmailJS template ID
        data,
        "publicKey_xxxxxx" // Replace with your EmailJS public key
      );
      setSuccess(true);
      reset();
    } catch (error) {
      alert("Erreur lors de l'envoi. Réessaie plus tard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Contacte-nous
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField
            label="Nom"
            fullWidth
            margin="normal"
            {...register("name", { required: "Nom requis" })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            {...register("email", {
              required: "Email requis",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email invalide",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Message"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            {...register("message", { required: "Message requis" })}
            error={!!errors.message}
            helperText={errors.message?.message}
          />

          <Box mt={2} display="flex" justifyContent="center">
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Envoyer"}
            </Button>
          </Box>

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Message envoyé avec succès 🎉
            </Alert>
          )}
        </form>
      </Paper>
    </Container>
  );
}