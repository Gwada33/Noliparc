"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@/app/context/AuthContext";
import ReactDatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Link from "next/link";

type FormData = {
  date: Date;
  formule: string;
  childrenCount: number;
  adultsCount: number;
  extras: string;
};

const formules = [
  { value: "formule-grenouille", label: "Formule Grenouille", enfantMin: 8 },
  {
    value: "formule-foumi-manioc",
    label: "Formule Foumi Manioc",
    enfantMin: 28,
  },
  {
    value: "formule-mangouste-(privatisation-dimanche)",
    label: "Formule Mangouste (privatisation dimanche)",
    enfantMin: 18,
    isPrivatisation: true,
  },
  { value: "happyjump-birthday", label: "HappyJump Birthday", enfantMin: 18 },
  { value: "partyjump-birthday", label: "PartyJump Birthday", enfantMin: 58 },
  { value: "fiestajump-birthday", label: "FiestaJump Birthday", enfantMin: 28 },
  {
    value: "golden-birthday-(privatisation-dimanche)",
    label: "GOLDEN Birthday (privatisation dimanche)",
    enfantMin: 48,
    isPrivatisation: true,
  },
];

export default function ReserverAnniversairePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const { user } = useAuth();
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formuleFromUrl = searchParams.get("formule") || "";

  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      date: undefined,
      formule: formuleFromUrl,
      childrenCount: 0,
      adultsCount: 0,
      extras: "",
    },
  });

  const watchFormule = watch("formule");
  const selectedFormule = formules.find((f) => f.value === watchFormule);
  const formuleDetails = formules.find((f) => f.value === selectedFormule);
  const onlySunday = formuleDetails?.isPrivatisation;

  // Cherche les infos de la formule choisie

  // Valeurs dynamiques selon la formule
  const enfantMin = selectedFormule?.enfantMin || 0;
  const enfantMax = selectedFormule ? enfantMin + 10 : 20; // ex: max = min + 10
  const adulteMax = selectedFormule ? enfantMin / 2 : 10; // ex: max adulte = min enfants / 2

  const onSubmit = async (data: FormData) => {
    if (!user?.id) {
      setErrorMsg("Identifiant utilisateur manquant.");
      return;
    }

    setConfirmation(null);
    setErrorMsg(null);

    try {
      const resp = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...data }),
      });

      if (!resp.ok) throw new Error(`Erreur ${resp.status}`);

      // Stocke les données pour les afficher dans le modal
      setSubmittedData(data);
      setModalOpen(true);
    } catch (err: any) {
      setErrorMsg(`Impossible d’enregistrer la réservation. ${err.message}`);
    }
  };

  if (!user) return <p>Utilisateur non trouvé.</p>;

  return (
    <Box sx={{ padding: 4, maxWidth: 500, margin: "auto" }}>
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Demande envoyée !</DialogTitle>
        <DialogContent dividers>
          <Typography>
            <strong>Formule :</strong>{" "}
            {formules.find((f) => f.value === submittedData?.formule)?.label}
          </Typography>
          <Typography>
            <strong>Date :</strong>{" "}
            {submittedData?.date?.toLocaleDateString("fr-FR")}
          </Typography>
          <Typography>
            <strong>Enfants :</strong> {submittedData?.childrenCount}
          </Typography>
          <Typography>
            <strong>Adultes :</strong> {submittedData?.adultsCount}
          </Typography>
          {submittedData?.extras && (
            <Typography>
              <strong>Infos :</strong> {submittedData.extras}
            </Typography>
          )}
          <Typography>
            <Link href="https://mail.google.com/mail/u/0/#inbox/" >
              Voir l'email de confirmation
            </Link>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModalOpen(false);
              window.location.href = "/";
            }}
          >
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h5" gutterBottom>
        Faire une demande pour un anniversaire
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Date */}
        {/* Formule */}
        <FormControl fullWidth margin="normal" error={!!errors.formule}>
          <InputLabel>Formule</InputLabel>
          <Controller
            name="formule"
            control={control}
            rules={{ required: "Formule requise" }}
            render={({ field }) => (
              <Select {...field} label="Formule">
                {formules.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{errors.formule?.message}</FormHelperText>
        </FormControl>

        <Controller
          control={control}
          name="date"
          rules={{ required: "Date requise" }}
          render={({ field }) => (
            <FormControl fullWidth margin="normal">
              <ReactDatePicker
                placeholderText="Choisir une date"
                selected={field.value}
                onChange={field.onChange}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                filterDate={
                  onlySunday ? (date) => date.getDay() === 0 : undefined
                }
                customInput={
                  <TextField
                    label="Date"
                    error={!!errors.date}
                    helperText={errors.date?.message}
                    fullWidth
                  />
                }
              />
            </FormControl>
          )}
        />

        {/* Enfants */}
        <TextField
          fullWidth
          margin="normal"
          type="number"
          label={`Nombre d'enfants (min ${enfantMin}, max ${enfantMax})`}
          {...register("childrenCount", {
            required: "Nombre requis",
            min: { value: enfantMin, message: `Minimum ${enfantMin} enfants` },
            max: { value: enfantMax, message: `Maximum ${enfantMax} enfants` },
            valueAsNumber: true,
          })}
          error={!!errors.childrenCount}
          helperText={errors.childrenCount?.message}
        />

        {/* Adultes */}
        <TextField
          fullWidth
          margin="normal"
          type="number"
          label="Nombre d'adultes"
          {...register("adultsCount", {
            required: "Nombre requis",
            min: { value: 0, message: "Min 0" },
            max: { value: 20, message: "Max 20" },
            valueAsNumber: true,
          })}
          error={!!errors.adultsCount}
          helperText={errors.adultsCount?.message}
        />

        {/* Extras */}
        <TextField
          fullWidth
          margin="normal"
          label="Informations supplémentaires"
          multiline
          rows={3}
          {...register("extras")}
        />

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Envoi..." : "Envoyer ma demande"}
        </Button>
      </form>

      {/* Messages */}
      {errorMsg && (
        <Typography color="error" mt={2} whiteSpace="pre-line">
          {errorMsg}
        </Typography>
      )}

      {confirmation && (
        <Typography color="success.main" mt={2} whiteSpace="pre-line">
          {confirmation}
        </Typography>
      )}
    </Box>
  );
}
