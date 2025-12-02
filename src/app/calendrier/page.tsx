"use client";

import React from "react";
import Calendar from "@/components/Calendar";
import { EventsProvider } from "@/app/context/EventsContext";

export default function PageCalendrier() {
  const year = new Date().getFullYear();
  const month = 12; // Décembre
  return (
    <EventsProvider>
      <main className="page" style={{ padding: 24 }}>
        <Calendar year={year} month={month} storageKey={`calendar-${year}-12`} editable={false} />
      </main>
    </EventsProvider>
  );
}
