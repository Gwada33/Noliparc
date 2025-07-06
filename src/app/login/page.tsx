import { Suspense } from "react";
import Login from "./Login";
import Loading from "@/components/ui/Loading";
import { Alert } from "@mui/material";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Login />
      <Alert severity="info" sx={{ 
        position: 'absolute', 
        bottom: 20, 
        left: 20, 
        right: 20,
        maxWidth: 1200,
        margin: 'auto',
        zIndex: 1000 
      }}>
        Attention : En raison d'un problème technique, certains comptes créés entre le 4 et le 6 juillet ont été supprimés. Merci de recréer votre compte si nécessaire.
      </Alert>
    </Suspense>
  );
}
