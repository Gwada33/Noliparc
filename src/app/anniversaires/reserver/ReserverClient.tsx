"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@/app/context/AuthContext";
import ReactDatePicker from "react-datepicker";

import "./react-date-picker.css"

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
  { value: "formule-grenouille", label: "Formule Grenouille", enfantMin: 14 },
  {
    value: "formule-foumi-manioc",
    label: "Formule Foumi Manioc",
    enfantMin: 15,
  },
  {
    value: "formule-mangouste-(privatisation-dimanche)",
    label: "Formule Mangouste (privatisation dimanche)",
    enfantMin: 20,
    isPrivatisation: true,
  },
  { value: "happyjump-birthday", label: "HappyJump Birthday", enfantMin: 8 },
  { value: "partyjump-birthday", label: "PartyJump Birthday", enfantMin: 8 },
  { value: "fiestajump-birthday", label: "FiestaJump Birthday", enfantMin: 8 },
  {
    value: "golden-birthday-(privatisation-dimanche)",
    label: "GOLDEN Birthday (privatisation dimanche)",
    enfantMin: 15,
    isPrivatisation: true,
  },
];

export default function ReserverClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { user } = useAuth();
  const [finalModalOpen, setFinalModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [shapes, setShapes] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    const newShapes = [...Array(20)].map((_, i) => {
      const size = Math.floor(Math.random() * 300) + 50; // 50–200px
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

  const formuleFromUrl = searchParams.get("formule") || "";

  const {
    control,
    register,
    watch,
    setValue,
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
  const formuleDetails = selectedFormule;
  const onlySunday = formuleDetails?.isPrivatisation;

  useEffect(() => {
    if (!selectedFormule) return;

    const isPrivatisation = selectedFormule.isPrivatisation;
    const currentDate = watch("date");

    if (!currentDate) return;

    const currentDay = currentDate.getDay();

    if (isPrivatisation && currentDay !== 0) {
      // Trouve le dimanche suivant
      const nextSunday = new Date(currentDate);
      const daysToAdd = (7 - currentDay) % 7;
      nextSunday.setDate(currentDate.getDate() + daysToAdd);

      setValue("date", nextSunday);
    }

    if (!isPrivatisation && currentDay === 0) {
      // Optionnel : on peut réinitialiser la date si c'était un dimanche pour une formule non-privatisation
      // setValue("date", null);
    }
  }, [watchFormule, setValue, watch, selectedFormule]);

const handleFormSubmit = (data: FormData) => {
  setSubmittedData(data);
  setModalOpen(true);
};


  // Cherche les infos de la formule choisie

  // Valeurs dynamiques selon la formule
  const enfantMin = selectedFormule?.enfantMin || 0;

  const onSubmit = async (data: FormData) => {
  if (!user?.id || hasSubmitted) return;

  setHasSubmitted(true);
  setErrorMsg(null);

  try {
    const resp = await fetch("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, ...data }),
    });

    if (!resp.ok) throw new Error(`Erreur ${resp.status}`);

    setModalOpen(false);       // Ferme 1er modal
    setFinalModalOpen(true);   // Ouvre 2e modal
  } catch (err: any) {
    setErrorMsg(`Erreur de réservation : ${err.message}`);
    setHasSubmitted(false); // Permet de réessayer
  }
};


  if (!user) return <p>Utilisateur non trouvé.</p>;

  return (
    <Box sx={{ padding: 4, maxWidth: 700, margin: "auto" }}>
    <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
  <DialogTitle>Confirmer votre demande</DialogTitle>
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
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setModalOpen(false)}>Modifier</Button>
    <Button
      onClick={() => onSubmit(submittedData!)}
      variant="contained"
      disabled={hasSubmitted}
    >
      Confirmer et envoyer
    </Button>
  </DialogActions>
</Dialog>
<Dialog open={finalModalOpen} onClose={() => setFinalModalOpen(false)}>
  <DialogTitle>Demande envoyée !</DialogTitle>
  <DialogContent dividers>
    <Typography gutterBottom>
      ✅ Votre demande a bien été enregistrée.
    </Typography>
    <Typography whiteSpace="pre-line" gutterBottom>
      ⚠️ Un acompte de 50% est requis pour réserver. Non remboursable en cas
      d'annulation, mais échangeable contre un report ou des entrées.
      {"\n"}🚫 Boissons et aliments extérieurs interdits.
      {"\n"}🧦 Chaussettes obligatoires pour tous.
    </Typography>
    <Typography mt={2}>
      📧{" "}
      <Link
        href="https://mail.google.com/mail/u/0/#inbox/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "underline" }}
      >
        Voir l'email de confirmation sur Gmail
      </Link>
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => {
        setFinalModalOpen(false);
        router.push("/");
      }}
    >
      Fermer
    </Button>
  </DialogActions>
</Dialog>



      <Typography variant="h4" color="#000" gutterBottom>
        Demande pour un anniversaire
      </Typography>

<form onSubmit={handleSubmit(handleFormSubmit)}>

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
                    autoComplete="off" // 👉 ajoute ceci ici
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
          label={`Nombre d'enfants (min ${enfantMin})`}
          {...register("childrenCount", {
            required: "Nombre requis",
            min: { value: enfantMin, message: `Minimum ${enfantMin} enfants` },
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
      <div className="magicpattern-container">{shapes}</div>
    </Box>
  );
}
