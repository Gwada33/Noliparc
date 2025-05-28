import { Suspense } from "react";
import ReserverClient from "./ReserverClient";
import { Box } from "@mui/material";

export default function Page() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ReserverClient />
      </Box>
    </Suspense>
  );
}
