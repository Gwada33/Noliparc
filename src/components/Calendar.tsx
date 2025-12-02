"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Switch, TextField, Typography } from "@mui/material";
import { useEvents } from "@/app/context/EventsContext";

type DayInfo = {
  date: string;
  open: boolean;
  note?: string;
  color?: string;
  events?: { title: string }[];
};

type CalendarData = {
  year: number;
  month: number; // 1-12
  days: Record<string, DayInfo>;
};

interface CalendarProps {
  year: number;
  month: number; // 1-12
  storageKey?: string;
  editable?: boolean;
}

function getDaysInMonth(year: number, month1to12: number) {
  const monthIndex = month1to12 - 1;
  const date = new Date(year, monthIndex, 1);
  const days: Date[] = [];
  while (date.getMonth() === monthIndex) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function Calendar({ year, month, storageKey, editable = false }: CalendarProps) {
  const key = storageKey ?? `calendar-${year}-${month}`;
  const [data, setData] = useState<CalendarData>(() => ({ year, month, days: {} }));
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const { fetchEventsByMonth } = useEvents();

  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/calendar/availability?year=${year}&month=${month}`);
        if (res.ok) {
          const json = await res.json();
          const initialDays: Record<string, DayInfo> = {};
          for (const d of days) {
            const iso = d.toISOString().slice(0, 10);
            initialDays[iso] = { date: iso, open: false, events: [] };
          }
          for (const a of json.items as { date: string; open: boolean; note?: string }[]) {
            initialDays[a.date] = { date: a.date, open: a.open, note: a.note, color: a.open ? '#3FBF3F' : '#D3D3D3', events: [] };
          }
          const monthEvents = await fetchEventsByMonth(year, month);
          for (const event of monthEvents) {
            const eventDate = event.date.slice(0, 10);
            if (initialDays[eventDate]) {
              initialDays[eventDate].events?.push({ title: event.title });
            }
          }
          setData({ year, month, days: initialDays });
          try { localStorage.setItem(key, JSON.stringify({ year, month, days: initialDays })); } catch {}
          return;
        }
      } catch {}
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw) as CalendarData;
          setData(parsed);
        } else {
          const initialDays: Record<string, DayInfo> = {};
          for (const d of days) {
            const iso = d.toISOString().slice(0, 10);
            initialDays[iso] = { date: iso, open: false, events: [] };
          }
          setData({ year, month, days: initialDays });
        }
      } catch {}
    })();
  }, [year, month]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {}
  }, [data, key]);

  const weekDays = ["Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim."];

  const firstDayIndex = (() => {
    const first = new Date(year, month - 1, 1);
    // JS: Sunday=0..Saturday=6 ; we want Monday=0..Sunday=6
    const jsIdx = first.getDay();
    return (jsIdx + 6) % 7;
  })();

  const handleToggleOpen = async (iso: string) => {
    setData((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [iso]: {
          ...prev.days[iso],
          open: !prev.days[iso]?.open,
          color: !prev.days[iso]?.open ? "#3FBF3F" : "#D3D3D3",
        },
      },
    }));
    try {
      const current = data.days[iso];
      const payload = { open: !current?.open, note: current?.note };
      await fetch(`/api/calendar/availability/${iso}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch {}
  };

  const handleEdit = (iso: string) => {
    const d = data.days[iso];
    if (!d) return;
    setSelectedDay(d);
    setNoteDraft(d.note ?? "");
  };

  const handleSaveNote = async () => {
    if (!selectedDay) return;
    setData((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [selectedDay.date]: { ...prev.days[selectedDay.date], note: noteDraft },
      },
    }));
    try {
      await fetch(`/api/calendar/availability/${selectedDay.date}` , { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ open: data.days[selectedDay.date]?.open ?? false, note: noteDraft }) });
    } catch {}
    setSelectedDay(null);
    setNoteDraft("");
  };

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <Box>
      <Typography variant="h4" color="#000000" gutterBottom>
        Calendrier {monthLabel}
      </Typography>

      <div className="calendar">
        <div className="calendar-head">
          {weekDays.map((wd) => (
            <div key={wd} className="calendar-head-cell" style={{ color: '#000' }}>
              {wd}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`pad-${i}`} className="calendar-cell pad" />
          ))}

          {days.map((d) => {
            const iso = d.toISOString().slice(0, 10);
            const info = data.days[iso];
            const isOpen = info?.open;
            return (
              <div
                key={iso}
                className={`calendar-cell ${isOpen ? "open" : "closed"}`}
              >
                <div className="calendar-cell-top">
                  <span className="day-number">{d.getDate()}</span>
                  {editable && (
                    <Switch
                      checked={!!isOpen}
                      onChange={() => handleToggleOpen(iso)}
                      inputProps={{ "aria-label": "Ouverture" }}
                    />
                  )}
                </div>
                <div className="calendar-cell-body">
                  {info?.note && (
                    <Typography className="note" variant="body2" sx={{ color: '#000' }}>
                      {info.note}
                    </Typography>
                  )}
                  {info?.events?.map((event, index) => (
                    <Typography key={index} className="event" variant="body2" sx={{ color: '#000', fontWeight: 'bold' }}>
                      {event.title}
                    </Typography>
                  ))}
                </div>
                {editable && (
                  <div className="calendar-cell-actions">
                    <Button size="small" variant="outlined" onClick={() => handleEdit(iso)}>
                      Éditer
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="calendar-legend">
          <div className="legend-item" style={{ color: '#000' }}>
            <span className="legend-dot open" color="#000" /> Ouvert
          </div>
          <div className="legend-item" style={{ color: '#000' }}>
            <span className="legend-dot closed" color="#000" /> Fermé
          </div>
        </div>
      </div>

      <Dialog open={!!selectedDay} onClose={() => setSelectedDay(null)}>
        <DialogTitle sx={{ color: '#000' }}>Notes du {selectedDay?.date}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            label="Note / informations"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={() => setSelectedDay(null)}>Annuler</Button>
          <Button variant="contained" onClick={handleSaveNote}>Sauvegarder</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
