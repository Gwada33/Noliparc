import { Stepper, Step, StepLabel, Typography, Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface ResponsiveStepperProps {
  steps: string[];
  activeStep: number;
}

export function ResponsiveStepper({ steps, activeStep }: ResponsiveStepperProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (isMobile) {
    // Version mobile compacte avec meilleur contraste
    return (
      <Box
        sx={{
          width: "100%",
          py: 2,
          px: 3,
          backgroundColor: "#e0f2f1", // vert clair pastel
          borderRadius: 2,
          border: "1px solid #b2dfdb",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{ color: "#004d40", fontWeight: 500 }}
        >
          Étape {activeStep + 1} sur {steps.length}
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: "#00695c", fontWeight: "bold", mt: 0.5 }}
        >
          {steps[activeStep]}
        </Typography>
      </Box>
    );
  }

  // Version desktop complète
  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ flexWrap: "wrap" }}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel
            sx={{
              whiteSpace: "normal",
              fontSize: "0.875rem",
              lineHeight: 1.2,
            }}
          >
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
