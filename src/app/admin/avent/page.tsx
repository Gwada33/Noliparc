"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useAuth } from "@/app/context/AuthContext";

type SurpriseType = 'text' | 'image' | 'link';

export default function AdminAventPage() {
  const { user } = useAuth();
  const year = new Date().getFullYear();
  const month = 12;
  const [buttonLabel, setButtonLabel] = useState('Découvrir');
  const [days, setDays] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const conf = await fetch('/api/advent/config');
      if (conf.ok) {
        const c = await conf.json();
        setButtonLabel(c.buttonLabel || 'Découvrir');
      }
      const res = await fetch(`/api/advent/days?year=${year}&month=${month}`);
      const json = await res.json();
      setDays(json.items || []);
    })();
  }, [year, month]);

  if (!user) return <Box p={4}><Typography color="error">Accès restreint. Veuillez vous connecter.</Typography></Box>;

  const saveLabel = async () => {
    await fetch('/api/advent/config', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ buttonLabel }) });
  };

  const saveDay = async (date: string, payload: { day: number; opened: boolean; surprise: { type: SurpriseType; content: string } }) => {
    await fetch(`/api/advent/day/${date}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ date, ...payload }) });
  };

  return (
    <main className="page" style={{ padding: 24 }}>
      <Typography variant="h4" color="#000000" gutterBottom>Administration - Calendrier de l'Avent</Typography>

      <Box display="flex" gap={2} alignItems="center" mb={3}>
        <TextField label="Libellé du bouton" value={buttonLabel} onChange={(e) => setButtonLabel(e.target.value)} />
        <Button variant="contained" onClick={saveLabel}>Sauvegarder</Button>
      </Box>

      <Grid container spacing={2}>
        {Array.from({ length: 24 }).map((_, i) => {
          const d = i + 1;
          const date = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const existing = days.find((x) => x.date === date) || { date, day: d, opened: false, surprise: { type: 'text', content: '' } };
          const [type, setType] = [existing.surprise.type as SurpriseType, (v: SurpriseType) => (existing.surprise.type = v)];
          const [content, setContent] = [existing.surprise.content as string, (v: string) => (existing.surprise.content = v)];
          const [opened, setOpened] = [!!existing.opened, (v: boolean) => (existing.opened = v)];

          return (
            <Grid xs={12} sm={6} md={4} key={date} item>
              <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                <Typography fontWeight={700}>Jour {d}</Typography>
                <TextField label="Type (text|image|link)" value={type} onChange={(e) => setType(e.target.value as SurpriseType)} sx={{ mt: 1 }} />
                <TextField label="Contenu" value={content} onChange={(e) => setContent(e.target.value)} sx={{ mt: 1 }} />
                <TextField label="Ouvert (true/false)" value={String(opened)} onChange={(e) => setOpened(e.target.value === 'true')} sx={{ mt: 1 }} />
                <Button sx={{ mt: 1 }} variant="contained" onClick={() => saveDay(date, { day: d, opened, surprise: { type, content } })}>Sauvegarder</Button>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </main>
  );
}

