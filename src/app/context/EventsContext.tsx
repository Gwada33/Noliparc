"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { toast } from 'react-hot-toast';

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

interface EventsContextType {
  events: Event[];
  totalPages: number;
  loading: boolean;
  error: string | null;
  fetchEvents: (page: number, status: string, category: string) => void;
  fetchEventsByMonth: (year: number, month: number) => Promise<Event[]>;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Event) => void;
  deleteEvent: (id: string) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (page: number, status: string, category: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: page.toString(), status, category });
      const response = await fetch(`/api/admin/events?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(data.data);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError("Erreur lors de la récupération des événements");
      toast.error("Erreur lors de la récupération des événements");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEventsByMonth = useCallback(async (year: number, month: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ year: year.toString(), month: month.toString() });
      const response = await fetch(`/api/admin/events?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events for month");
      }
      const data = await response.json();
      return data.data;
    } catch (e) {
      setError("Erreur lors de la récupération des événements du mois");
      toast.error("Erreur lors de la récupération des événements du mois");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addEvent = async (event: Event) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      if (!response.ok) {
        throw new Error("Failed to add event");
      }
      await fetchEvents(1, '', '');
      toast.success("Événement ajouté avec succès !");
    } catch (e) {
      setError("Erreur lors de l'ajout de l'événement");
      toast.error("Erreur lors de l'ajout de l'événement");
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: string, event: Event) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/events?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });
      if (!response.ok) {
        throw new Error("Failed to update event");
      }
      await fetchEvents(1, '', '');
      toast.success("Événement mis à jour avec succès !");
    } catch (e) {
      setError("Erreur lors de la mise à jour de l'événement");
      toast.error("Erreur lors de la mise à jour de l'événement");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/events?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
      await fetchEvents(1, '', '');
      toast.success("Événement supprimé avec succès !");
    } catch (e) {
      setError("Erreur lors de la suppression de l'événement");
      toast.error("Erreur lors de la suppression de l'événement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EventsContext.Provider value={{ events, totalPages, loading, error, fetchEvents, fetchEventsByMonth, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};
