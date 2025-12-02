'use client';

import React, { useState, useEffect } from 'react';
import EventForm from '@/components/EventForm';
import { useEvents } from '@/app/context/EventsContext';
import '@/css/admin-dashboard.css';

// Define the Event type for type safety
interface Event {
  id?: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  image?: string;
  capacity?: number;
  price?: number;
  category?: string;
  status?: string;
  visibility?: string;
}

const EventsPage = () => {
  // State from the global context
  const { events, totalPages, loading, error, fetchEvents, addEvent, updateEvent, deleteEvent } = useEvents();

  // Local state for filters and pagination
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch events when page or filters change
  useEffect(() => {
    fetchEvents(page, status, category);
  }, [page, status, category, fetchEvents]);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Handle saving (creating or updating) an event
  const handleSave = async (eventData: Event) => {
    if (editingEvent && editingEvent.id) {
      await updateEvent(editingEvent.id, eventData);
    } else {
      await addEvent(eventData);
    }
    setEditingEvent(null); // Close the form
  };

  // Handle deleting an event
  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      await deleteEvent(id);
    }
  };

  return (
    <main className="admin-container">
      <h1>Gestion des Événements</h1>

      {/* Show form for editing or creating, otherwise show the create button */}
      {editingEvent ? (
        <section className="card" style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e0e0e0' }}>
          <EventForm event={editingEvent} onSave={handleSave} onCancel={() => setEditingEvent(null)} />
        </section>
      ) : (
        <button className="btn btn-primary" onClick={() => setEditingEvent({} as Event)}>Créer un nouvel événement</button>
      )}

      {/* Filter controls */}
      <div className="card" style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e0e0e0', marginTop: '1rem' }}>
        <div className="form-group">
          <label>Statut</label>
          <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tous</option>
          <option value="upcoming">À venir</option>
          <option value="past">Passé</option>
          <option value="cancelled">Annulé</option>
          </select>
        </div>

        <div className="form-group" style={{ marginTop: '0.5rem' }}>
          <label>Catégorie</label>
          <input className="form-control" type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Filtrer par catégorie..." />
        </div>
      </div>

      {/* Loading and error states */}
      {loading && <div>Chargement des événements...</div>}
      {error && <div style={{ color: 'red' }}>Erreur: {error}</div>}

      {/* Event list and pagination */}
      {!loading && !error && (
        <>
          {isMobile ? (
            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr', gap: '1rem' }}>
              {events.map((event) => (
                <section key={event.id} className="card" style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e0e0e0' }}>
                  <h3 style={{ marginTop: 0 }}>{event.title}</h3>
                  <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString('fr-FR')} {event.time ? `— ${event.time}` : ''}</p>
                  <p><strong>Lieu:</strong> {event.location}</p>
                  <div style={{ marginTop: '0.5rem' }}>
                    <button className="btn btn-secondary" onClick={() => setEditingEvent(event)}>Modifier</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(event.id!)} style={{ marginLeft: '10px' }}>Supprimer</button>
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <section className="card" style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e0e0e0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Titre</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Lieu</th>
                    <th style={{ padding: '1rem', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem' }}>{event.title}</td>
                      <td style={{ padding: '1rem' }}>{new Date(event.date).toLocaleDateString('fr-FR')} {event.time ? `— ${event.time}` : ''}</td>
                      <td style={{ padding: '1rem' }}>{event.location}</td>
                      <td style={{ padding: '1rem' }}>
                        <button className="btn btn-secondary" onClick={() => setEditingEvent(event)}>Modifier</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(event.id!)} style={{ marginLeft: '10px' }}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {/* Pagination controls */}
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Précédent
            </button>
            <span style={{ margin: '0 10px' }}>
              Page {page} sur {totalPages}
            </span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
              Suivant
            </button>
          </div>
        </>
      )}
    </main>
  );
};

export default EventsPage;
