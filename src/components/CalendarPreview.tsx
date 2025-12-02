"use client";

import React from "react";
import useSWR from "swr";
import { Box, CircularProgress, Typography } from "@mui/material";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Props {
  year: number;
  month: number; // 1-12
}

export default function CalendarPreview({ year, month }: Props) {
  const { data, error, isLoading } = useSWR(`/api/calendar/availability?year=${year}&month=${month}`, fetcher, {
    revalidateOnFocus: false,
  });

  const items: { date: string; open: boolean; note?: string }[] = data?.items ?? [];
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  // Capitalize first letter
  const title = `Calendrier ${monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}`;
  
  const weekDays = ["L", "M", "M", "J", "V", "S", "D"];
  
  // Helper to find first day of month offset (Monday=0)
  const firstDayIndex = (() => {
    const first = new Date(year, month - 1, 1);
    const jsIdx = first.getDay();
    return (jsIdx + 6) % 7;
  })();
  
  const daysInMonth = new Date(year, month, 0).getDate();

  return (
    <Link href={`/calendrier`} className="calendar-preview-link">
      <Box className="calendar-preview">
        <Box display="flex" alignItems="center" mb={1}>
          <FaCalendarAlt size={22} style={{ marginRight: 10, color: "#000" }} />
          <Typography variant="h4" color="#000" fontWeight="bold" fontFamily="Rubik">
            {title}
          </Typography>
        </Box>

        {isLoading && <CircularProgress size={24} sx={{ mt: 2 }} />}
        {error && <Typography color="error">Erreur de chargement</Typography>}
        {!isLoading && !error && (
          <div className="calendar-preview-grid">
            {weekDays.map((d, i) => (
              <div key={`wd-${i}`} className="preview-head">{d}</div>
            ))}
            
            {/* Empty cells for offset */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dayStr = String(dayNum).padStart(2, '0');
              const date = `${year}-${String(month).padStart(2, '0')}-${dayStr}`;
              const info = items.find((x) => x.date === date);
              const cls = info?.open ? 'open' : 'closed';
              
              return (
                <div key={date} className={`preview-cell ${cls}`}>
                  {dayNum}
                </div>
              );
            })}
          </div>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          Cliquez pour voir le détail
        </Typography>
      </Box>
    </Link>
  );
}
