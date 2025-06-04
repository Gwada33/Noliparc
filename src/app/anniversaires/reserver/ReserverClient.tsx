"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@/app/context/AuthContext";

import { formules } from "@/lib/formules";

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
  Stepper,
  Step,
  StepLabel,
  Grid,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {fr} from "date-fns/locale/fr";

import Link from "next/link";

type FormData = {
  formule: string;
  date: Date | null;
  timeSlot: string;
  childrenName: string;
  childrenCount: number;
  adultsCount: number;
  extras: string;
};

export default function ReserverClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [finalModalOpen, setFinalModalOpen] = useState(false);
  const [isSingleSlot, setIsSingleSlot] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Titres des étapes pour le Stepper
  const steps = [
    "Choisir la formule",
    "Sélectionner date & créneau",
    "Participants & Infos",
    "Récapitulatif",
  ];

  // Initialisation de react-hook-form
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      formule: searchParams.get("formule") || "",
      date: null,
      timeSlot: "",
      childrenName: "",
      childrenCount: 0,
      adultsCount: 0,
      extras: "",
    },
  });

  const watchFormule = watch("formule");
  const watchDate = watch("date");
  const watchTimeSlot = watch("timeSlot");

  // On récupère l’objet 'Formule' sélectionné dans formules.ts
  const selectedFormule = formules.find((f) => f.value === watchFormule);
  const onlySunday = selectedFormule?.isPrivatisation ?? false;
  const enfantMin = selectedFormule?.enfantMin || 0;

  // Si privatisation, on force la date au prochain dimanche
  useEffect(() => {
    if (!selectedFormule) return;
    if (!watchDate) return;

    if (selectedFormule.isPrivatisation) {
      const currentDay = watchDate.getDay();
      if (currentDay !== 0) {
        const nextSunday = new Date(watchDate);
        const daysToAdd = (7 - currentDay) % 7;
        nextSunday.setDate(watchDate.getDate() + daysToAdd);
        setValue("date", nextSunday);
      }
    }
  }, [watchFormule, watchDate, selectedFormule, setValue]);

  useEffect(() => {
  if (selectedFormule?.timeSlots?.length === 1) {
    const uniqueSlot = selectedFormule.timeSlots[0];
    setValue("timeSlot", uniqueSlot);
    setIsSingleSlot(true);
  } else {
    setIsSingleSlot(false);
    setValue("timeSlot", ""); // pour reset si on change de formule
  }
}, [selectedFormule, setValue]);


  // Navigation du Stepper
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Soumission finale vers l’API
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

      setSubmittedData(data);
      handleConfirm()
    } catch (err: any) {
      setErrorMsg(`Erreur de réservation : ${err.message}`);
      setHasSubmitted(false);
    }
  };

  const handleConfirm = () => {
    setFinalModalOpen(true);
  };

  if (!user) return <Typography>Utilisateur non trouvé.</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
      <Typography variant="h4" color="#000000" gutterBottom>
        Demande pour un anniversaire
      </Typography>

      {/* ---------- STEPper MUI ---------- */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ---------- Étape 0 : Choisir la formule ---------- */}
        {activeStep === 0 && (
          <Box>
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
          </Box>
        )}

        {/* ---------- Étape 1 : Date & Créneau (issu de la formule) ---------- */}
        {activeStep === 1 && (
          <LocalizationProvider dateAdapter={AdapterDateFns} dateLibInstance={fr}
          >
            <Box>
              {/* DatePicker de MUI */}
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date requise" }}
                render={({ field }) => (
                  <DatePicker
                    label="Date"
                    value={field.value}
                    onChange={field.onChange}
                    minDate={new Date()}
                    shouldDisableDate={(date) =>
                      onlySunday ? date.getDay() !== 0 : false
                    }
                    enableAccessibleFieldDOMStructure={false}
                    slots={{
                      textField: (params) =>
                      <TextField
                        {...params}
                        fullWidth
                        margin="normal"
                        error={!!errors.date}
                        helperText={errors.date?.message}
                      />
                    }}
                  />
                )}
              />

              {/* Sélection du créneau : on tire les créneaux de selectedFormule.timeSlots */}
              <FormControl
                fullWidth
                margin="normal"
                error={!!errors.timeSlot}
                disabled={!selectedFormule || isSingleSlot}
              >
                <InputLabel>Créneau horaire</InputLabel>
                <Controller
                  name="timeSlot"
                  control={control}
                  rules={{ required: "Créneau requis" }}
                  render={({ field }) => (
                    <Select {...field} label="Créneau horaire" disabled={isSingleSlot}>
                      {selectedFormule?.timeSlots?.map((slot: string) => (
                        <MenuItem key={slot} value={slot}>
                          {slot}
                        </MenuItem>
                      )) || (
                        <MenuItem value="">
                          <em>Aucune formule sélectionnée</em>
                        </MenuItem>
                      )}
                    </Select>
                  )}
                />
                <FormHelperText>
                  {errors.timeSlot?.message ||
                    (!selectedFormule && "Choisissez d’abord une formule")}
                </FormHelperText>
              </FormControl>
            </Box>
          </LocalizationProvider>
        )}

        {/* ---------- Étape 2 : Participants & Infos supplémentaires ---------- */}
        {activeStep === 2 && (
          <Box>

            <TextField
              fullWidth
              margin="normal"
              type="text"
              label={`Prénom de l'enfant`}
              {...register("childrenName", {
                required: "Prénom requis",
              })}
              error={!!errors.childrenName}
              helperText={errors.childrenName?.message}
            />

            <TextField
              fullWidth
              margin="normal"
              type="number"
              label={`Nombre d'enfants (min ${enfantMin})`}
              {...register("childrenCount", {
                required: "Nombre requis",
                min: {
                  value: enfantMin,
                  message: `Minimum ${enfantMin} enfant(s)`,
                },
                valueAsNumber: true,
              })}
              error={!!errors.childrenCount}
              helperText={errors.childrenCount?.message}
            />

            <TextField
              fullWidth
              margin="normal"
              type="number"
              label="Nombre d'adultes (max 4)"
              {...register("adultsCount", {
                required: "Nombre requis",
                min: { value: 0, message: "Minimum 0" },
                max: { value: 4, message: "Maximum 4"},
                valueAsNumber: true,
              })}
              error={!!errors.adultsCount}
              helperText={errors.adultsCount?.message}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Informations supplémentaires"
              multiline
              rows={3}
              {...register("extras")}
            />
          </Box>
        )}

        {/* ---------- Étape 3 : Récapitulatif & envoi ---------- */}
        {activeStep === 3 && (
          <Box color={"#000000"}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Formule :</strong>{" "}
              {formules.find((f) => f.value === watchFormule)?.label}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Date :</strong>{" "}
              {watchDate
                ? watchDate.toLocaleDateString("fr-FR")
                : "Non renseignée"}
            </Typography>
             <Typography variant="subtitle1" gutterBottom>
              <strong>Nom de l'enfant :</strong> {watch("childrenName") || "Non renseigné"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Créneau :</strong> {watchTimeSlot || "Non renseigné"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Enfants :</strong> {watch("childrenCount")}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Adultes :</strong> {watch("adultsCount")}
            </Typography>
            {watch("extras") && (
              <Typography variant="subtitle1" gutterBottom>
                <strong>Infos :</strong> {watch("extras")}
              </Typography>
            )}
          </Box>
        )}

        {/* ---------- Boutons Précédent / Suivant / Envoyer ---------- */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid>
            {activeStep > 0 && (
              <Button variant="outlined" onClick={handleBack}>
                Précédent
              </Button>
            )}
          </Grid>

          <Grid>
            {activeStep < steps.length - 1 && (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && !watchFormule) ||
                  (activeStep === 1 &&
                    (!watchDate || !watchTimeSlot || !selectedFormule)) ||
                  (activeStep === 2 &&
                    (watch("childrenCount") < enfantMin ||
                      watch("adultsCount") < 0))
                }
              >
                Suivant
              </Button>
            )}

            {activeStep === steps.length - 1 && (
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi..." : "Envoyer ma demande"}
              </Button>
            )}
          </Grid>
        </Grid>
      </form>

      <Dialog open={finalModalOpen} onClose={() => setFinalModalOpen(false)}>
        <DialogTitle>Demande envoyée !</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            ✅ Votre demande a bien été enregistrée.
          </Typography>
          <Typography whiteSpace="pre-line" gutterBottom>
            ⚠️ Un acompte de 50% est requis pour réserver. Non remboursable en
            cas d'annulation, mais échangeable contre un report ou des entrées.
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

      {errorMsg && (
        <Typography color="error" mt={2} whiteSpace="pre-line">
          {errorMsg}
        </Typography>
      )}
    </Box>
  );
}
