"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { FaSearch, FaCheck, FaTimes, FaTrash, FaEye, FaCalendarAlt, FaClock, FaChild, FaBirthdayCake, FaList, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '@/css/admin-dashboard.css';

// Types
interface Reservation {
  id: string;
  date: string;
  timeSlot: string;
  formule: string;
  status: string;
  createdAt: string;
  childName: string;
  childAge: number;
  childrenCount: number;
  adultsCount: number;
  cake: string;
  extras: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
}

export default function ReservationsPage() {
  const { user: currentUser } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [availability, setAvailability] = useState<{date: string, reason: string}[]>([]);

  useEffect(() => {
    if (currentUser?.role !== 'admin') return;
    fetchReservations();
    fetchAvailability();
  }, [currentUser, search, statusFilter]);

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/admin/availability');
      if (res.ok) {
        const data = await res.json();
        setAvailability(data.map((d: any) => ({
          ...d,
          date: new Date(d.date).toISOString().split('T')[0]
        })));
      }
    } catch (error) {
      console.error("Failed to fetch availability", error);
    }
  };

  const toggleAvailability = async (dateStr: string, isBlocked: boolean) => {
    if (isBlocked) {
      if (!confirm(`Voulez-vous débloquer la date du ${dateStr} ?`)) return;
      await fetch(`/api/admin/availability?date=${dateStr}`, { method: 'DELETE' });
    } else {
      const reason = prompt(`Bloquer la date du ${dateStr} ? Raison :`, "Fermeture exceptionnelle");
      if (!reason) return;
      await fetch('/api/admin/availability', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ date: dateStr, reason })
      });
    }
    fetchAvailability();
  };

  const fetchReservations = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      
      const res = await fetch(`/api/admin/reservations?${params.toString()}`);
      const data = await res.json();
      if (data.reservations) {
        setReservations(data.reservations);
      }
    } catch (error) {
      console.error("Failed to fetch reservations", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if (!confirm(`Voulez-vous passer cette réservation en "${newStatus}" ?`)) return;

    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        fetchReservations();
        if (selectedReservation?.id === id) setSelectedReservation(null);
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.")) return;
    
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchReservations();
        if (selectedReservation?.id === id) setSelectedReservation(null);
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting reservation", error);
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <div className="admin-container">Accès refusé</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>Confirmée</span>;
      case 'cancelled': return <span style={{ background: '#ffebee', color: '#c62828', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>Annulée</span>;
      case 'pending': return <span style={{ background: '#fff3e0', color: '#ef6c00', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>En attente</span>;
      default: return <span style={{ background: '#f5f5f5', color: '#666', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>{status}</span>;
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const days = getDaysInMonth(year, month);
    const firstDayIndex = days[0].getDay() === 0 ? 6 : days[0].getDay() - 1; // Start Monday
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    return (
      <div className="card" style={{ background: 'white', borderRadius: '12px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, textTransform: 'capitalize' }}>{monthNames[month]} {year}</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setCalendarDate(new Date(year, month - 1))} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer' }}><FaChevronLeft /></button>
            <button onClick={() => setCalendarDate(new Date())} style={{ padding: '0.5rem 1rem', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>Aujourd'hui</button>
            <button onClick={() => setCalendarDate(new Date(year, month + 1))} style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: 'white', cursor: 'pointer' }}><FaChevronRight /></button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#eee', border: '1px solid #eee' }}>
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(d => (
            <div key={d} style={{ background: '#f8f9fa', padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>{d}</div>
          ))}
          
          {Array(firstDayIndex).fill(null).map((_, i) => (
            <div key={`empty-${i}`} style={{ background: 'white', minHeight: '100px' }}></div>
          ))}

          {days.map(d => {
            const dateStr = d.toISOString().split('T')[0];
            const dayRes = reservations.filter(r => r.date.startsWith(dateStr));
            const isToday = new Date().toISOString().split('T')[0] === dateStr;
            const blockedInfo = availability.find(a => a.date === dateStr);
            const isBlocked = !!blockedInfo;

            return (
              <div key={dateStr} 
                style={{ 
                  background: isBlocked ? '#ffebee' : (isToday ? '#fff3e0' : 'white'), 
                  minHeight: '120px', 
                  padding: '0.5rem', 
                  border: '1px solid white',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  position: 'relative'
                }}
                className="calendar-day"
                onClick={() => {
                  // If needed, scroll to day or filter
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: isToday ? 'bold' : 'normal', color: isToday ? '#DB7C26' : '#333' }}>
                    {d.getDate()}
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleAvailability(dateStr, isBlocked); }}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1rem', padding: 0 }}
                    title={isBlocked ? "Débloquer" : "Bloquer"}
                  >
                    {isBlocked ? '🔒' : '🔓'}
                  </button>
                </div>

                {isBlocked && (
                  <div style={{ color: '#c62828', fontSize: '0.75rem', fontStyle: 'italic', marginBottom: '0.5rem', background: 'rgba(255,255,255,0.5)', padding: '2px 4px', borderRadius: '4px' }}>
                    {blockedInfo.reason}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {dayRes.map(r => (
                    <div 
                      key={r.id} 
                      onClick={(e) => { e.stopPropagation(); setSelectedReservation(r); }}
                      style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem', 
                        borderRadius: '4px', 
                        background: r.status === 'confirmed' ? '#e8f5e9' : r.status === 'cancelled' ? '#ffebee' : '#fff8e1',
                        color: r.status === 'confirmed' ? '#2e7d32' : r.status === 'cancelled' ? '#c62828' : '#f57c00',
                        borderLeft: `3px solid ${r.status === 'confirmed' ? '#2e7d32' : r.status === 'cancelled' ? '#c62828' : '#f57c00'}`,
                        cursor: 'pointer',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}
                      title={`${r.childName} - ${r.formule}`}
                    >
                      {r.timeSlot.toString().split('-')[0]} {r.childName}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="admin-container">
      <div className="section-title">
        Gestion des Réservations
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('list')}
          style={{ 
            padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: activeTab === 'list' ? '#DB7C26' : 'transparent',
            color: activeTab === 'list' ? 'white' : '#666',
            fontWeight: activeTab === 'list' ? 'bold' : 'normal',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <FaList /> Liste
        </button>
        <button 
          onClick={() => setActiveTab('calendar')}
          style={{ 
            padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: activeTab === 'calendar' ? '#DB7C26' : 'transparent',
            color: activeTab === 'calendar' ? 'white' : '#666',
            fontWeight: activeTab === 'calendar' ? 'bold' : 'normal',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <FaCalendarAlt /> Calendrier
        </button>
      </div>

      {activeTab === 'list' && (
        <>
          {/* Filters */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
              <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input
                type="text"
                placeholder="Rechercher (nom, email...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '1rem'
                }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ddd', minWidth: '150px' }}
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>

          {/* Reservations Table */}
          <div className="card" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Date & Créneau</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Client & Enfant</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Formule</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Statut</th>
                  <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                        <FaCalendarAlt color="#DB7C26" />
                        {new Date(res.date).toLocaleDateString('fr-FR')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        <FaClock />
                        {Array.isArray(res.timeSlot) ? res.timeSlot.join(', ') : res.timeSlot}
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 'bold' }}>{res.childName} ({res.childAge} ans)</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>Parent: {res.user?.firstName} {res.user?.lastName}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ textTransform: 'capitalize' }}>{res.formule.replace(/_/g, ' ')}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{res.childrenCount} enfants, {res.adultsCount} adultes</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {getStatusBadge(res.status)}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => setSelectedReservation(res)} title="Détails" style={{ marginRight: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2' }}>
                        <FaEye size={18} />
                      </button>
                      {res.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(res.id, 'confirmed')} title="Confirmer" style={{ marginRight: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#2e7d32' }}>
                            <FaCheck size={18} />
                          </button>
                          <button onClick={() => updateStatus(res.id, 'cancelled')} title="Annuler" style={{ marginRight: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#c62828' }}>
                            <FaTimes size={18} />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(res.id)} title="Supprimer" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d32f2f' }}>
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'calendar' && renderCalendar()}



      {/* Detail Modal */}
      {selectedReservation && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0 }}>Détails de la réservation</h2>
              <button onClick={() => setSelectedReservation(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ color: '#DB7C26', borderBottom: '2px solid #DB7C26', paddingBottom: '0.5rem', marginTop: 0 }}>Informations Événement</h3>
                <p><strong>Date :</strong> {new Date(selectedReservation.date).toLocaleDateString('fr-FR')}</p>
                <p><strong>Créneau :</strong> {Array.isArray(selectedReservation.timeSlot) ? selectedReservation.timeSlot.join(', ') : selectedReservation.timeSlot}</p>
                <p><strong>Formule :</strong> {selectedReservation.formule}</p>
                <p><strong>Statut :</strong> {getStatusBadge(selectedReservation.status)}</p>
              </div>

              <div>
                <h3 style={{ color: '#DB7C26', borderBottom: '2px solid #DB7C26', paddingBottom: '0.5rem', marginTop: 0 }}>L'enfant</h3>
                <p><strong>Nom :</strong> {selectedReservation.childName}</p>
                <p><strong>Âge :</strong> {selectedReservation.childAge} ans</p>
                <p><strong>Gâteau :</strong> {selectedReservation.cake}</p>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ color: '#DB7C26', borderBottom: '2px solid #DB7C26', paddingBottom: '0.5rem' }}>Participants & Contact</h3>
              <p><strong>Participants :</strong> {selectedReservation.childrenCount} enfants, {selectedReservation.adultsCount} adultes</p>
              <p><strong>Contact Parent :</strong> {selectedReservation.user?.firstName} {selectedReservation.user?.lastName}</p>
              <p><strong>Email :</strong> {selectedReservation.user?.email}</p>
              <p><strong>Téléphone :</strong> {selectedReservation.user?.phone}</p>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ color: '#DB7C26', borderBottom: '2px solid #DB7C26', paddingBottom: '0.5rem' }}>Extras & Notes</h3>
              <p>{selectedReservation.extras || "Aucun extra"}</p>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              {selectedReservation.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(selectedReservation.id, 'confirmed')} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: '#2e7d32', color: 'white', cursor: 'pointer' }}>
                    Confirmer
                  </button>
                  <button onClick={() => updateStatus(selectedReservation.id, 'cancelled')} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: '#c62828', color: 'white', cursor: 'pointer' }}>
                    Refuser
                  </button>
                </>
              )}
              <button onClick={() => setSelectedReservation(null)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
