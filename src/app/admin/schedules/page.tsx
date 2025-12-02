"use client";

import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCalendarAlt, FaSave } from "react-icons/fa";
import "@/css/admin-dashboard.css";

interface Schedule {
  id: number;
  location: string;
  season: string;
  headers: string[];
  rows: string[][];
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
}

export default function AdminSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  
  const [formData, setFormData] = useState<{
    location: string;
    season: string;
    headers: string[];
    rows: string[][];
  }>({
    location: 'Noliparc',
    season: '',
    headers: ['Horaires'],
    rows: [['Lundi', 'Fermé']]
  });

  // Mapping for display text
  const getLocationLabel = (loc: string) => {
    const map: Record<string, string> = {
      'Noliparc': 'Noliparc (Parc de jeux)',
      'Nolijump': 'Nolijump (Trampoline)'
    };
    return map[loc] || loc;
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await fetch('/api/admin/schedules');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSchedules(data);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      const res = await fetch('/api/admin/events?page=1&limit=10');
      const data = await res.json();
      if (Array.isArray(data.data)) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setEventsLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingSchedule(null);
    setFormData({
      location: 'Noliparc',
      season: '',
      headers: ['Age 3-6', 'Age 7+'],
      rows: [
        ['Lun.', 'Fermé', 'Fermé'],
        ['Mar.', '10h-18h', '10h-18h'],
        ['Mer.', '10h-18h', '10h-18h'],
        ['Jeu.', '10h-18h', '10h-18h'],
        ['Ven.', '10h-18h', '10h-18h'],
        ['Sam.', '10h-18h', '10h-18h'],
        ['Dim.', '10h-18h', '10h-18h'],
      ]
    });
    setShowModal(true);
  };

  const openEditModal = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      location: schedule.location,
      season: schedule.season,
      headers: schedule.headers,
      rows: schedule.rows
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSchedule ? { ...formData, id: editingSchedule.id } : formData)
      });
      
      if (res.ok) {
        setShowModal(false);
        fetchSchedules();
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet horaire ?")) return;
    try {
      await fetch(`/api/admin/schedules?id=${id}`, { method: 'DELETE' });
      fetchSchedules();
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  // Helper to update specific cell in rows
  const updateRowCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = formData.rows.map((row, rIdx) => {
      if (rIdx === rowIndex) {
        if (Array.isArray(row)) {
          const newRow = [...row];
          newRow[colIndex] = value;
          return newRow;
        }
      }
      return row;
    });
    setFormData({ ...formData, rows: newRows });
  };

  // Helper to update headers
  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...formData.headers];
    newHeaders[index] = value;
    setFormData({ ...formData, headers: newHeaders });
  };

  const addColumn = () => {
    setFormData({
      ...formData,
      headers: [...formData.headers, 'Nouvelle col.'],
      rows: formData.rows.map(row => [...row, 'Fermé'])
    });
  };

  const removeColumn = (index: number) => {
    setFormData({
      ...formData,
      headers: formData.headers.filter((_, i) => i !== index),
      rows: formData.rows.map(row => row.filter((_, i) => i !== index + 1)) // +1 because row[0] is Day
    });
  };

  return (
    <main className="admin-container">
      <div className="section-title" style={{ justifyContent: 'space-between' }}>
        <span>Gestion des Horaires</span>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FaPlus aria-hidden="true" /> Ajouter
        </button>
      </div>

      <div className="dashboard-grid grid-cols-kpi">
        {schedules.map(schedule => (
          <article key={schedule.id} className="kpi-card" style={{ borderLeft: `4px solid ${schedule.location === 'Noliparc' ? '#DB7C26' : '#2e7d32'}` }}>
            <div style={{ width: '100%' }}>
              <div className="kpi-label" style={{ 
                color: schedule.location === 'Noliparc' ? '#DB7C26' : '#2e7d32', 
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {getLocationLabel(schedule.location)}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-icon" onClick={() => openEditModal(schedule)} title="Modifier">
                    <FaEdit />
                  </button>
                  <button className="btn-icon" onClick={() => handleDelete(schedule.id)} style={{ color: '#c62828' }} title="Supprimer">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <h3 style={{ margin: '0.5rem 0', fontSize: '1.3rem', fontWeight: '700' }}>{schedule.season}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                <FaCalendarAlt style={{ marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                Colonnes : {schedule.headers.join(', ')}
              </p>
            </div>
          </article>
        ))}
      </div>

      <section className="card" style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="section-title" style={{ margin: 0 }}>Événements</h2>
          <a href="/admin/events" className="btn btn-primary" style={{ textDecoration: 'none' }}>Gérer les événements</a>
        </div>
        {eventsLoading ? (
          <p style={{ color: '#666' }}>Chargement...</p>
        ) : (
          <div className="table-container" style={{ overflowX: 'auto', padding: 0 }}>
            <table className="admin-table" style={{ width: '100%' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Titre</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Lieu</th>
                </tr>
              </thead>
              <tbody>
                {events.map(ev => (
                  <tr key={ev.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>{ev.title}</td>
                    <td style={{ padding: '1rem' }}>{new Date(ev.date).toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>{ev.location}</td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ padding: '1rem', color: '#666', textAlign: 'center' }}>Aucun événement</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content" style={{ maxWidth: '900px', width: '95%' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingSchedule ? 'Modifier' : 'Ajouter'} un horaire
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="form-group">
                  <label style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Lieu concerné</label>
                  <select 
                    className="form-control"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    style={{ height: '48px' }}
                  >
                    <option value="Noliparc">Noliparc (Parc de jeux)</option>
                    <option value="Nolijump">Nolijump (Trampoline)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Nom de la période / Saison</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.season}
                    onChange={e => setFormData({...formData, season: e.target.value})}
                    placeholder="Ex: Période Scolaire, Vacances d'Été..."
                    required
                    style={{ height: '48px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                 <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Grille des horaires</h4>
                 <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                   Modifiez les colonnes (ex: tranches d'âge) et les horaires pour chaque jour. Utilisez "Fermé" pour les jours de fermeture.
                 </p>
              </div>

              <div className="table-container" style={{ overflowX: 'auto', padding: '0' }}>
                <table className="admin-table" style={{ width: '100%' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ width: '100px', padding: '1rem' }}>Jour</th>
                      {formData.headers.map((header, i) => (
                        <th key={i} style={{ minWidth: '150px', padding: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={header}
                              onChange={e => updateHeader(i, e.target.value)}
                              className="form-control"
                              style={{ padding: '0.4rem', fontSize: '0.9rem', fontWeight: 'bold', textAlign: 'center' }}
                            />
                            <button 
                              type="button" 
                              onClick={() => removeColumn(i)} 
                              style={{ color: '#c62828', border: 'none', background: 'rgba(198, 40, 40, 0.1)', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                              title="Supprimer la colonne"
                            >
                              &times;
                            </button>
                          </div>
                        </th>
                      ))}
                      <th style={{ width: '100px', verticalAlign: 'middle' }}>
                        <button type="button" onClick={addColumn} className="btn btn-sm btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                          <FaPlus size={10} /> Col.
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.rows.map((row, rIndex) => (
                      <tr key={rIndex}>
                        <td style={{ fontWeight: 'bold', padding: '0.5rem 1rem', background: '#fff' }}>
                          <input
                             type="text"
                             value={Array.isArray(row) ? row[0] : ''}
                             onChange={e => updateRowCell(rIndex, 0, e.target.value)}
                             className="form-control"
                             style={{ width: '100%', border: 'none', background: 'transparent', fontWeight: 'bold' }}
                             disabled
                          />
                        </td>
                        {Array.isArray(row) && row.slice(1).map((cell, cIndex) => (
                          <td key={cIndex} style={{ padding: '0.5rem' }}>
                            <input
                              type="text"
                              value={cell}
                              onChange={e => updateRowCell(rIndex, cIndex + 1, e.target.value)}
                              className="form-control"
                              style={{ textAlign: 'center' }}
                            />
                          </td>
                        ))}
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  <FaSave /> Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
