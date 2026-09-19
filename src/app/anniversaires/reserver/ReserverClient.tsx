"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@/app/context/AuthContext";
import generateShapes from "@/utils/GererateShapes";
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
import { fr } from "date-fns/locale/fr";

import Link from "next/link";
import { ResponsiveStepper } from "@/components/ReactiveStepper";
import BackgroundShapes from "@/utils/GererateShapes";

type FormData = {
  formule: string;
  date: Date | null;
  timeSlot: string;
  childrenName: string;
  childAge: number;
  childrenCount: number;
  adultsCount: number;
  cake: string;
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

  // Titres des étapes pour le Stepper (6 étapes au total)
  const steps = [
    "Choisir la formule",
    "Sélectionner date & créneau",
    "Infos enfant",
    "Participants",
    "Gâteau & Extras",
    "Récapitulatif",
  ];

  // On initialise le form avec react-hook-form
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
      childAge: 0,
      childrenCount: 0,
      adultsCount: 0,
      cake: "",
      extras: "",
    },
  });

  const watchFormule = watch("formule");
  const watchDate = watch("date");
  const watchTimeSlot = watch("timeSlot");
  const watchChildAge = watch("childAge");
  const watchChildrenCount = watch("childrenCount");
  const watchAdultsCount = watch("adultsCount");

  // Récupère la formule sélectionnée dans formules.ts
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

  // Si la formule ne propose qu'un seul créneau, on l'applique et on disable le Select
  useEffect(() => {
    if (selectedFormule?.timeSlots?.length === 1) {
      const uniqueSlot = selectedFormule.timeSlots[0];
      setValue("timeSlot", uniqueSlot);
      setIsSingleSlot(true);
    } else {
      setIsSingleSlot(false);
      setValue("timeSlot", "");
    }
  }, [selectedFormule, setValue]);

  // Navigation du Stepper
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Soumission finale vers l'API
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
      handleConfirm();
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
    <>
      <BackgroundShapes  variant="anniversaire" count={30} />
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" color="#000000" gutterBottom>
        Demande pour un anniversaire
      </Typography>

      {/* ---------- STEPper MUI ---------- */}
     <ResponsiveStepper steps={steps} activeStep={activeStep} />


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

            {selectedFormule?.note && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                🧸 {selectedFormule.note}
              </Typography>
            )}
          </Box>
        )}

        {/* ---------- Étape 1 : Date & Créneau (issu de la formule) ---------- */}
        {activeStep === 1 && (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
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
                      textField: (params) => (
                        <TextField
                          {...params}
                          fullWidth
                          margin="normal"
                          error={!!errors.date}
                          helperText={errors.date?.message}
                        />
                      ),
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
                    <Select
                      {...field}
                      label="Créneau horaire"
                      disabled={isSingleSlot}
                    >
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

        {/* ---------- Étape 2 : Infos enfant (prénom + âge) ---------- */}
        {activeStep === 2 && (
          <Box>
            <TextField
              fullWidth
              margin="normal"
              type="text"
              label="Prénom de l'enfant"
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
              label="Âge que l'enfant aura le jour J"
              {...register("childAge", {
                required: "Âge requis",
                min: { value: 0, message: "Âge min 0" },
                valueAsNumber: true,
              })}
              error={!!errors.childAge}
              helperText={errors.childAge?.message}
            />
          </Box>
        )}

        {/* ---------- Étape 3 : Participants (nombre d'enfants & adultes) ---------- */}
        {activeStep === 3 && (
          <Box>
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

            <FormControl fullWidth margin="normal" error={!!errors.adultsCount}>
              <InputLabel>
                Nombre d'adultes (max {selectedFormule?.adultMax || 4})
              </InputLabel>
              <Controller
                name="adultsCount"
                control={control}
                rules={{
                  required: "Nombre requis",
                  min: { value: 1, message: "Minimum 1 adulte" },
                  max: { 
                    value: selectedFormule?.adultMax || 4, 
                    message: `Maximum ${selectedFormule?.adultMax || 4}` 
                  },
                }}
                render={({ field }) => (
                  <Select {...field} label="Nombre d'adultes">
                    {Array.from({ length: selectedFormule?.adultMax || 4 }, (_, i) => i + 1)
                      .map((n) => (
                        <MenuItem key={n} value={n}>
                          {n}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
              <FormHelperText>
                {errors.adultsCount?.message}
              </FormHelperText>
            </FormControl>
          </Box>
        )}

        {/* ---------- Étape 4 : Gâteau & Infos supplémentaires ---------- */}
        {activeStep === 4 && (
          <Box>
            <FormControl fullWidth margin="normal" error={!!errors.cake}>
              <InputLabel>Gâteau</InputLabel>
              <Controller
                name="cake"
                control={control}
                rules={{ required: "Précisez le gâteau" }}
                render={({ field }) => (
                  <Select {...field} label="Type de gâteau">
                    <MenuItem value="gateau_yaourt">Gâteau au yaourt</MenuItem>
                    <MenuItem value="gateau_chocolat">
                      Gâteau au chocolat
                    </MenuItem>
                  </Select>
                )}
              />
              <FormHelperText>{errors.cake?.message}</FormHelperText>
            </FormControl>

            {/* Champ d’informations supplémentaires */}
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

        {/* ---------- Étape 5 : Récapitulatif & envoi ---------- */}
        {activeStep === 5 && (
          <Box color="#000">
            <Typography variant="subtitle1" gutterBottom>
              <strong>Formule :</strong>{" "}
              {formules.find((f) => f.value === watchFormule)?.label}
            </Typography>
            {selectedFormule?.note && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                🧸 {selectedFormule.note}
              </Typography>
            )}
            <Typography variant="subtitle1" gutterBottom>
              <strong>Date :</strong>{" "}
              {watchDate
                ? watchDate.toLocaleDateString("fr-FR")
                : "Non renseignée"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Prénom enfant :</strong> {watch("childrenName") || "—"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Âge enfant :</strong> {watchChildAge} {" ans"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Créneau :</strong> {watchTimeSlot || "—"}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Enfants :</strong> {watchChildrenCount}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Adultes :</strong> {watchAdultsCount}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Gâteau :</strong> {watch("cake") || "—"}
            </Typography>
            {watch("extras") && (
              <Typography variant="subtitle1" gutterBottom>
                <strong>Infos :</strong> {watch("extras")}
              </Typography>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              ⚠️ Un acompte de 50% est requis pour réserver. Il est remboursable
              selon nos{" "}
              <Link
                href="/legal#annulation"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline" }}
              >
                conditions d&apos;annulation et de remboursement
              </Link>{" "}
              : remboursement de l&apos;acompte en cas d&apos;annulation plus de
              24 h avant la prestation ; à moins de 24 h, remboursement de 90 %
              uniquement sur présentation d&apos;un justificatif médical.
            </Typography>
          </Box>
        )}

        {/* ---------- Boutons “Précédent / Suivant / Envoyer” ---------- */}
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
                  // Si on n'a pas rempli les champs obligatoires de l'étape courante
                  (activeStep === 0 && !watchFormule) ||
                  (activeStep === 1 &&
                    (!watchDate || !watchTimeSlot || !selectedFormule)) ||
                  (activeStep === 2 &&
                    (!watch("childrenName") || watchChildAge < 0)) ||
                  (activeStep === 3 &&
                    (watchChildrenCount < enfantMin ||
                      watchAdultsCount < 0 ||
                      (selectedFormule?.adultMax ? watchAdultsCount > selectedFormule.adultMax : watchAdultsCount > 4))
                    )
                }
              >
                Suivant
              </Button>
            )}
            {activeStep === steps.length - 1 && (
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Envoi..." : "Envoyer ma demande"}
              </Button>
            )}
          </Grid>
        </Grid>
      </form>

      {/* ---------- Modal de confirmation final ---------- */}
      <Dialog open={finalModalOpen} onClose={() => setFinalModalOpen(false)}>
        <DialogTitle>Demande envoyée !</DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            ✅ Votre demande a bien été enregistrée.
          </Typography>
          <Typography whiteSpace="pre-line" gutterBottom>
            ⚠️ Un acompte de 50% est requis pour réserver, remboursable selon
            nos conditions d'annulation et de remboursement.
            {"\n"}🚫 Boissons et aliments extérieurs interdits.
            {"\n"}🧦 Chaussettes obligatoires pour tous.
          </Typography>
          <Typography mt={1}>
            📄{" "}
            <Link
              href="/legal#annulation"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
            >
              Lire les conditions d&apos;annulation et de remboursement
            </Link>
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
    </>
  );
}