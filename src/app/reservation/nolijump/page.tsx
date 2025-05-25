"use client";

import { useState } from "react";
import StepWizard from "react-step-wizard";
import QRCode from "react-qr-code";

const entryTypes = [
  { id: 1, label: "Entrée Trampoline 1h", price: 10 },
  { id: 2, label: "Entrée Trampoline 2h", price: 18 },
  { id: 3, label: "Accrobranche 1h", price: 12 },
  { id: 4, label: "Pack Trampoline + Accrobranche", price: 25 },
];

const generateSlots = () => {
  const slots = [];
  const startHour = 9;
  const endHour = 18;
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

export default function ReservationPage() {
  const [form, setForm] = useState({ name: "", date: "", entryId: null, slot: "" });
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [qrValue, setQrValue] = useState("");
  const slots = generateSlots();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleEntrySelect = entry => {
    setSelectedEntry(entry);
    setForm(prev => ({ ...prev, entryId: entry.id }));
  };

  const handleSubmit = async () => {
    const reservationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const payload = {
      id: reservationId,
      ...form,
      entryLabel: selectedEntry.label,
      price: selectedEntry.price,
    };
    // send to API
    await fetch("/api/reservation/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setQrValue(reservationId);
  };

  return (
    <div className="reservation-container">
      <h1>Réservation Noliparc</h1>
      <StepWizard>
        {({ nextStep }) => (
          <div>
            <h2>1. Choisissez votre formule</h2>
            {entryTypes.map(entry => (
              <button
                key={entry.id}
                onClick={() => handleEntrySelect(entry)}
                className={form.entryId === entry.id ? "selected" : ""}
              >
                {entry.label} - {entry.price}€
              </button>
            ))}
            <button onClick={nextStep} disabled={!form.entryId}>Suivant</button>
          </div>
        )}

        {({ previousStep, nextStep }) => (
          <div>
            <h2>2. Sélectionnez la date</h2>
            <input type="date" name="date" value={form.date} onChange={handleChange} />
            <div className="nav">
              <button onClick={previousStep}>Précédent</button>
              <button onClick={nextStep} disabled={!form.date}>Suivant</button>
            </div>
          </div>
        )}

        {({ previousStep, nextStep }) => (
          <div>
            <h2>3. Choisissez un créneau</h2>
            <select name="slot" value={form.slot} onChange={handleChange}>
              <option value="">-- Sélectionner --</option>
              {slots.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <div className="nav">
              <button onClick={previousStep}>Précédent</button>
              <button onClick={nextStep} disabled={!form.slot}>Suivant</button>
            </div>
          </div>
        )}

        {({ previousStep }) => (
          <div>
            <h2>4. Confirmation</h2>
            <label>
              Nom:
              <input type="text" name="name" value={form.name} onChange={handleChange} />
            </label>
            {selectedEntry && <p>Formule: {selectedEntry.label} ({selectedEntry.price}€)</p>}
            <p>Date: {form.date}</p>
            <p>Créneau: {form.slot}</p>
            <button onClick={previousStep}>Précédent</button>
            <button onClick={handleSubmit} disabled={!form.name}>Confirmer</button>
            {qrValue && (
              <div className="qr">
                <h3>Votre QR Code</h3>
                <QRCode value={qrValue} />
              </div>
            )}
          </div>
        )}
      </StepWizard>

      <style jsx>{`
        .reservation-container { max-width:400px; margin:auto; padding:1rem; font-family:sans-serif; }
        h1 { text-align:center; }
        button { margin:0.5rem 0; padding:0.5rem 1rem; }
        button.selected { background:#0070f3; color:#fff; }
        .nav { display:flex; justify-content:space-between; margin-top:1rem; }
        label, select, input { display:block; width:100%; margin:0.5rem 0; padding:0.5rem; }
        .qr { text-align:center; margin-top:1rem; }
      `}</style>
    </div>
  );
}
