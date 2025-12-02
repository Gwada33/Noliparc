"use client";

import React, { useEffect, useState } from "react";
import { Alert, Box, Typography, CircularProgress } from "@mui/material";
import { FaTools } from "react-icons/fa";

interface ParkConfig {
  maintenanceMode: boolean;
  parkStatus: 'open' | 'closed' | 'maintenance';
  globalMessage: string;
  alertLevel: 'none' | 'info' | 'warning' | 'error';
  nextOpening: string;
}

export default function GlobalStatus() {
  const [config, setConfig] = useState<ParkConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading config", err);
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (!config) return null;

  // Maintenance Mode Overlay
  if (config.maintenanceMode) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'background.default',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 4
        }}
      >
        <FaTools size={64} color="#DB7C26" style={{ marginBottom: '2rem' }} />
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Site en Maintenance
        </Typography>
        <Typography variant="h6" color="text.secondary" maxWidth="600px">
          Nous effectuons actuellement des mises à jour pour améliorer votre expérience. 
          Le site sera de nouveau accessible très bientôt.
        </Typography>
        {config.globalMessage && (
          <Alert severity="info" sx={{ mt: 4, maxWidth: '600px' }}>
            {config.globalMessage}
          </Alert>
        )}
      </Box>
    );
  }

  return null;
}
