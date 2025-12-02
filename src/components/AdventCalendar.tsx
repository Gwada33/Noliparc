"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import AdventCountdown from "./AdventCountdown";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Surprise { type: 'text' | 'image' | 'link'; content: string }
interface Day { date: string; day: number; opened: boolean; surprise: Surprise }

function iso(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function AdventCalendar() {
  const year = new Date().getFullYear();
  const month = 12;
  const { data, error, isLoading, mutate } = useSWR(`/api/advent/days?year=${year}&month=${month}`, fetcher, { revalidateOnFocus: false });
  const [selected, setSelected] = useState<Day | null>(null);
  const [buttonLabel, setButtonLabel] = useState<string>('Découvrir');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/advent/config');
        if (res.ok) {
          const json = await res.json();
          setButtonLabel(json.buttonLabel || 'Découvrir');
        }
      } catch {}
      try {
        const local = localStorage.getItem('advent-button-label');
        if (local) setButtonLabel(local);
      } catch {}
    })();
  }, []);

  const days: Day[] = (() => {
    const map: Record<string, Day> = {};
    for (let d = 1; d <= 24; d++) {
      const date = iso(year, month, d);
      map[date] = { date, day: d, opened: false, surprise: { type: 'text', content: '' } };
    }
    for (const item of (data?.items ?? [])) {
      map[item.date] = item;
    }
    return Object.values(map).slice(0, 24);
  })();

  const open = async (day: Day) => {
    try {
      const res = await fetch(`/api/advent/open/${day.date}`, { method: 'POST' });
      if (res.ok) {
        const saved = await res.json();
        setSelected(saved);
        await mutate();
      }
    } catch {}
  };

  const onCustomizeLabel = (val: string) => {
    setButtonLabel(val);
    try { localStorage.setItem('advent-button-label', val); } catch {}
  };

  return (
    <Box className="advent" sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: 2 }}>
      <AdventCountdown />
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField aria-label="Libellé du bouton" label="Libellé du bouton" size="small" value={buttonLabel} onChange={(e) => onCustomizeLabel(e.target.value)} />
      </Box>

      {isLoading && <Typography>Chargement...</Typography>}
      {error && <Typography color="error">Erreur de chargement</Typography>}

      <div className="advent-grid" role="grid" aria-label="Calendrier de l'Avent">
        {days.map((d) => (
          <button
            key={d.date}
            role="gridcell"
            aria-label={`Jour ${d.day}${d.opened ? ' (ouvert)' : ''}`}
            className={`advent-door ${d.opened ? 'opened' : ''}`}
            onClick={() => open(d)}
          >
            <span className="label">{d.day}</span>
          </button>
        ))}
      </div>

      <Dialog open={!!selected} onClose={() => setSelected(null)}>
        <DialogTitle>Surprise du {selected?.day}</DialogTitle>
        <DialogContent>
          {selected?.surprise?.type === 'text' && (
            <Typography>{selected?.surprise?.content || 'Surprise à venir ✨'}</Typography>
          )}
          {selected?.surprise?.type === 'link' && (
            <Typography><a href={selected?.surprise?.content} target="_blank" rel="noopener noreferrer">{buttonLabel}</a></Typography>
          )}
          {selected?.surprise?.type === 'image' && (
            <img src={selected?.surprise?.content} alt="Surprise" style={{ maxWidth: '100%', borderRadius: 8 }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setSelected(null)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

