import { createTheme } from "@mui/material/styles";

// Thème MUI aligné sur la charte graphique Noliparc.
// Les tokens CSS restent la source de vérité ; on les répercute ici pour
// que les composants MUI (boutons, liens, champs) soient cohérents.
export const theme = createTheme({
  palette: {
    primary: {
      main: "#DB7C26",
      dark: "#B05A12",
      light: "#F4A85C",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#03a9f4",
      dark: "#0288d1",
      contrastText: "#ffffff",
    },
    error: { main: "#d32f2f" },
    success: { main: "#2e7d32" },
    warning: { main: "#ef6c00" },
    info: { main: "#1565c0" },
    background: { default: "#ffffff", paper: "#ffffff" },
    text: { primary: "#171717", secondary: "#555555" },
  },
  typography: {
    fontFamily: 'var(--font-sans)',
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 999,
        },
      },
    },
  },
});
