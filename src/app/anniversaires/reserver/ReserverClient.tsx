"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@/app/context/AuthContext";
import { formules, SOCKS_PRICE_CHILD, SOCKS_PRICE_ADULT } from "@/lib/formules";

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
  socksChildren: number;
  socksAdults: number;
};

const fmt = (n: number) =>
  n.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " €";

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

  // 5 étapes : les écrans "Infos enfant" et "Participants" sont fusionnés
  const steps = [
    "Choisir la formule",
    "Date & créneau",
    "Enfant & participants",
    "Gâteau & options",
    "Récapitulatif",
  ];

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
      socksChildren: 0,
      socksAdults: 0,
    },
  });

  const watchFormule = watch("formule");
  const watchDate = watch("date");
  const watchTimeSlot = watch("timeSlot");
  const watchChildrenCount = watch("childrenCount") || 0;
  const watchAdultsCount = watch("adultsCount") || 0;
  const socksChildren = watch("socksChildren") || 0;
  const socksAdults = watch("socksAdults") || 0;

  const selectedFormule = formules.find((f) => f.value === watchFormule);
  const onlySunday = selectedFormule?.isPrivatisation ?? false;
  const enfantMin = selectedFormule?.enfantMin || 0;
  const adultMax = selectedFormule?.adultMax || 4;

  // Estimation du montant total (formule × enfants + privatisation + chaussettes)
  const estimate = (() => {
    if (!selectedFormule) return 0;
    let total = watchChildrenCount * (selectedFormule.pricePerChild || 0);
    if (
      selectedFormule.privatisationHourly &&
      selectedFormule.privatisationHours
    ) {
      total += selectedFormule.privatisationHourly * selectedFormule.privatisationHours;
    }
    total += socksChildren * SOCKS_PRICE_CHILD;
    total += socksAdults * SOCKS_PRICE_ADULT;
    return total;
  })();

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

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Soumission finale vers l'API (les chaussettes sont ajoutées aux extras)
  const onSubmit = async (data: FormData) => {
    if (!user?.id || hasSubmitted) return;
    setHasSubmitted(true);
    setErrorMsg(null);

    const socksLines: string[] = [];
    if (data.socksChildren)
      socksLines.push(`${data.socksChildren} chaussette(s) enfant (5€/unité)`);
    if (data.socksAdults)
      socksLines.push(`${data.socksAdults} chaussette(s) adulte (8,99€/unité)`);
    const extrasText = [data.extras, ...socksLines].filter(Boolean).join(", ");

    try {
      const resp = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...data, extras: extrasText }),
      });
      if (!resp.ok) throw new Error(`Erreur ${resp.status}`);

      setSubmittedData(data);
      setFinalModalOpen(true);
    } catch (err: any) {
      setErrorMsg(`Erreur de réservation : ${err.message}`);
      setHasSubmitted(false);
    }
  };

  const nextDisabled =
    (activeStep === 0 && !watchFormule) ||
    (activeStep === 1 && (!watchDate || !watchTimeSlot || !selectedFormule)) ||
    (activeStep === 2 &&
      (!watch("childrenName") ||
        watch("childAge") < 0 ||
        watchChildrenCount < enfantMin ||
        watchAdultsCount < 1 ||
        watchAdultsCount > adultMax)) ||
    (activeStep === 3 && !watch("cake"));

  if (!user) return <Typography>Utilisateur non trouvé.</Typography>;

  return (
    <>
      <BackgroundShapes variant="anniversaire" count={30} />
      <Box className="reserve-form" sx={{ p: 4, maxWidth: 660, mx: "auto" }}>
        <Typography variant="h4" color="#000000" gutterBottom>
          Demande pour un anniversaire
        </Typography>

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

              {selectedFormule && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#FDF1E5",
                    border: "1px solid #F4A85C",
                  }}
                >
                  <Typography fontWeight={700} color="#B05A12">
                    {selectedFormule.label}
                  </Typography>
                  <Typography variant="body2" color="#555">
                    {fmt(selectedFormule.pricePerChild)} / enfant · minimum{" "}
                    {selectedFormule.enfantMin} enfants
                    {selectedFormule.privatisationHourly
                      ? ` · privatisation ${fmt(selectedFormule.privatisationHourly)}/heure`
                      : ""}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* ---------- Étape 1 : Date & Créneau ---------- */}
          {activeStep === 1 && (
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
              <Box>
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

                <FormControl
                  fullWidth
                  margin="normal"
                  error={!!errors.timeSlot}
                  disabled={!selectedFormule}
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

          {/* ---------- Étape 2 : Enfant & participants (fusionnée) ---------- */}
          {activeStep === 2 && (
            <Box>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  margin="normal"
                  type="text"
                  label="Prénom de l'enfant"
                  {...register("childrenName", { required: "Prénom requis" })}
                  error={!!errors.childrenName}
                  helperText={errors.childrenName?.message}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  type="number"
                  label="Âge le jour J"
                  {...register("childAge", {
                    required: "Âge requis",
                    min: { value: 0, message: "Âge min 0" },
                    valueAsNumber: true,
                  })}
                  error={!!errors.childAge}
                  helperText={errors.childAge?.message}
                />
              </Box>

              <TextField
                fullWidth
                margin="normal"
                type="number"
                label={`Nombre d'enfants (min ${enfantMin})`}
                {...register("childrenCount", {
                  required: "Nombre requis",
                  min: {
                    value: enfantMin,
                    message: `Minimum ${enfantMin} enfant(s) pour cette formule`,
                  },
                  valueAsNumber: true,
                })}
                error={!!errors.childrenCount}
                helperText={errors.childrenCount?.message}
              />

              <FormControl fullWidth margin="normal" error={!!errors.adultsCount}>
                <InputLabel>Nombre d'adultes (max {adultMax})</InputLabel>
                <Controller
                  name="adultsCount"
                  control={control}
                  rules={{
                    required: "Nombre requis",
                    min: { value: 1, message: "Minimum 1 adulte" },
                    max: { value: adultMax, message: `Maximum ${adultMax}` },
                  }}
                  render={({ field }) => (
                    <Select {...field} label="Nombre d'adultes">
                      {Array.from({ length: adultMax }, (_, i) => i + 1).map((n) => (
                        <MenuItem key={n} value={n}>
                          {n}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FormHelperText>{errors.adultsCount?.message}</FormHelperText>
              </FormControl>

              {/* Estimation en temps réel */}
              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: "#FDEBEF",
                  border: "1px solid #F48FB1",
                }}
              >
                <Typography fontWeight={700} color="#c2185b" gutterBottom>
                  Estimation
                </Typography>
                <Typography variant="body2" color="#555">
                  {watchChildrenCount} × {fmt(selectedFormule?.pricePerChild || 0)}
                  {selectedFormule?.privatisationHourly
                    ? ` + privatisation ${fmt(
                        selectedFormule.privatisationHourly *
                          (selectedFormule.privatisationHours || 1)
                      )}`
                    : ""}
                  {socksChildren + socksAdults > 0
                    ? ` + chaussettes ${fmt(
                        socksChildren * SOCKS_PRICE_CHILD +
                          socksAdults * SOCKS_PRICE_ADULT
                      )}`
                    : ""}
                </Typography>
                <Typography variant="h6" fontWeight={800} color="#000">
                  ≈ {fmt(estimate)}
                </Typography>
                <Typography variant="caption" color="#666">
                  (hors acompte de 50 % à la réservation)
                </Typography>
              </Box>
            </Box>
          )}

          {/* ---------- Étape 3 : Gâteau & options (chaussettes) ---------- */}
          {activeStep === 3 && (
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
                      <MenuItem value="gateau_chocolat">Gâteau au chocolat</MenuItem>
                    </Select>
                  )}
                />
                <FormHelperText>{errors.cake?.message}</FormHelperText>
              </FormControl>

              <Typography variant="subtitle2" sx={{ mt: 2, fontWeight: 700 }}>
                🧦 Chaussettes anti-dérapantes (obligatoires au trampoline)
              </Typography>
              <Box display="flex" gap={2}>
                <TextField
                  fullWidth
                  margin="normal"
                  type="number"
                  label={`Chaussettes enfant (${fmt(SOCKS_PRICE_CHILD)}/unité)`}
                  {...register("socksChildren", {
                    min: { value: 0, message: "Valeur incorrecte" },
                    valueAsNumber: true,
                  })}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  type="number"
                  label={`Chaussettes adulte (${fmt(SOCKS_PRICE_ADULT)}/unité)`}
                  {...register("socksAdults", {
                    min: { value: 0, message: "Valeur incorrecte" },
                    valueAsNumber: true,
                  })}
                />
              </Box>

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

          {/* ---------- Étape 4 : Récapitulatif & envoi ---------- */}
          {activeStep === 4 && (
            <Box color="#000">
              <Typography variant="subtitle1" gutterBottom>
                <strong>Formule :</strong>{" "}
                {formules.find((f) => f.value === watchFormule)?.label || "—"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Date :</strong>{" "}
                {watchDate ? watchDate.toLocaleDateString("fr-FR") : "Non renseignée"}
                {watchTimeSlot ? ` — ${watchTimeSlot}` : ""}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Enfant :</strong> {watch("childrenName") || "—"} (
                {watch("childAge") || 0} ans)
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Participants :</strong> {watchChildrenCount} enfant(s) ·{" "}
                {watchAdultsCount} adulte(s)
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Gâteau :</strong>{" "}
                {watch("cake") === "gateau_chocolat"
                  ? "Gâteau au chocolat"
                  : watch("cake") === "gateau_yaourt"
                    ? "Gâteau au yaourt"
                    : "—"}
              </Typography>
              {(socksChildren > 0 || socksAdults > 0) && (
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Chaussettes :</strong>{" "}
                  {[
                    socksChildren > 0 ? `${socksChildren} enfant(s)` : "",
                    socksAdults > 0 ? `${socksAdults} adulte(s)` : "",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </Typography>
              )}
              {watch("extras") && (
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Infos :</strong> {watch("extras")}
                </Typography>
              )}

              <Box
                sx={{
                  mt: 3,
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: "#FDF1E5",
                  border: "1px solid #F4A85C",
                }}
              >
                <Typography fontWeight={700} color="#B05A12">
                  Total estimé
                </Typography>
                <Typography variant="h5" fontWeight={800} color="#000">
                  ≈ {fmt(estimate)}
                </Typography>
                <Typography variant="caption" color="#666">
                  Acompte de 50 % à la réservation — le solde se règle sur place.
                </Typography>
              </Box>
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
                  disabled={nextDisabled}
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

        {/* ---------- Barre récapitulative mobile (sticky) ---------- */}
        <div className="mobile-summary">
          <div>
            <div className="mobile-summary__label">{steps[activeStep]}</div>
            <div className="mobile-summary__value">
              {selectedFormule?.label ?? "Choisissez une formule"}
            </div>
          </div>
          <div className="mobile-summary__price">≈ {fmt(estimate)}</div>
        </div>

        {/* ---------- Confirmation ---------- */}
        <Dialog
          open={finalModalOpen}
          onClose={() => {
            setFinalModalOpen(false);
            router.push("/");
          }}
        >
          <DialogTitle>Demande envoyée ! 🎉</DialogTitle>
          <DialogContent dividers>
            {submittedData && (
              <Box mb={2}>
                <Typography variant="body2" gutterBottom>
                  <strong>Formule :</strong>{" "}
                  {formules.find((f) => f.value === submittedData.formule)?.label}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Date :</strong>{" "}
                  {submittedData.date
                    ? new Date(submittedData.date).toLocaleDateString("fr-FR")
                    : "—"}{" "}
                  {submittedData.timeSlot ? `— ${submittedData.timeSlot}` : ""}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Participants :</strong> {submittedData.childrenCount}{" "}
                  enfant(s) · {submittedData.adultsCount} adulte(s)
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Total estimé :</strong>{" "}
                  {fmt(
                    (submittedData.childrenCount || 0) *
                      (selectedFormule?.pricePerChild || 0) +
                      (selectedFormule?.privatisationHourly || 0) *
                        (selectedFormule?.privatisationHours || 0) +
                      (submittedData.socksChildren || 0) * SOCKS_PRICE_CHILD +
                      (submittedData.socksAdults || 0) * SOCKS_PRICE_ADULT
                  )}
                </Typography>
              </Box>
            )}
            <Typography gutterBottom>
              ✅ Votre demande a bien été enregistrée. Notre équipe vous
              recontacte rapidement pour confirmer.
            </Typography>
            <Typography whiteSpace="pre-line" gutterBottom>
              ⚠️ Un acompte de 50% est requis pour réserver. Non remboursable en
              cas d'annulation, mais échangeable contre un report ou des entrées.
              {"\n"}🚫 Boissons et aliments extérieurs interdits.
              {"\n"}🧦 Chaussettes obligatoires pour tous.
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