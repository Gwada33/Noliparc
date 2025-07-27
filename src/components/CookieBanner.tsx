"use client";

import { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme, keyframes } from '@mui/material';
import Link from 'next/link';

// Animation pour le bouton
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà accepté les cookies
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent === null) {
      setShowBanner(true);
    }
  }, []);


  const acceptCookies = () => {
    // Enregistrer le consentement dans le localStorage
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
    
    };

  const declineCookies = () => {
    // Enregistrer le refus dans le localStorage
    localStorage.setItem('cookieConsent', 'declined');
    setShowBanner(false);
    
  };

  if (!showBanner) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        p: 3,
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1300, // Au-dessus de la plupart des éléments
      }}
    >
      <Box
        sx={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="body2" sx={{ flex: 1, mb: { xs: 2, md: 0 } }}>
          Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant votre navigation, vous acceptez notre{' '}
          <Link href="/legal#pdc" style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}>
            politique de confidentialité
          </Link>
          , nos{' '}
          <Link href="/legal#cgu" style={{ color: theme.palette.primary.main, textDecoration: 'underline' }}>
            conditions d'utilisation
          </Link>{' '}
          et l'utilisation de cookies.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={declineCookies}
            sx={{
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: theme.palette.error.main,
                color: theme.palette.error.main,
                backgroundColor: 'rgba(211, 47, 47, 0.04)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              },
              '&:active': {
                transform: 'translateY(0)'
              }
            }}
          >
            Refuser
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={acceptCookies}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: 'bold',
              textTransform: 'none',
              padding: '6px 16px',
              borderRadius: '4px',
              transition: 'all 0.3s ease',
              animation: `${pulse} 2s infinite`,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 12px ${theme.palette.primary.main}80`,
                animation: 'none'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }
            }}
          >
            Accepter
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
