"use client";

import React from "react";
import Calendar from "@/components/Calendar";
import { EventsProvider } from "@/app/context/EventsContext";

export default function PageCalendrier() {
  const year = new Date().getFullYear();
  const month = 12; // Décembre
  return (
    <EventsProvider>
      <>
        <header className="page-hero">
          <h1>Calendrier</h1>
          <p>
            Retrouvez nos jours d'ouverture et nos événements spéciaux tout au long de l'année.
          </p>
        </header>
        <div className="page-content">
          <Calendar year={year} month={month} storageKey={`calendar-${year}-12`} editable={false} />
        </div>
      </>
    </EventsProvider>
  );
}
