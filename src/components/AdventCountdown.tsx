"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

function diffToChristmas(now = new Date()) {
  const year = now.getFullYear();
  const target = new Date(year, 11, 25, 0, 0, 0);
  const ms = target.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export default function AdventCountdown() {
  const [left, setLeft] = useState(diffToChristmas());
  useEffect(() => {
    const t = setInterval(() => setLeft(diffToChristmas()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <Box className="advent-countdown" sx={{ textAlign: 'center', mb: 2 }} aria-live="polite">
      <Typography variant="h5" color="#000" fontWeight={700}>Plus que {left.days} j {left.hours} h {left.minutes} min {left.seconds} s avant Noël 🎄</Typography>
    </Box>
  );
}

