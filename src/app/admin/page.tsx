"use client";

import React, { useEffect, useState } from "react";
import { Typography, Box, Switch, FormControlLabel, TextField, MenuItem, Select, Button, Alert, Snackbar } from "@mui/material";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaCalendarAlt, FaGift, FaUsers, FaTicketAlt, FaBoxOpen, FaEnvelope, 
  FaExclamationCircle, FaCheckCircle, FaClock, FaSave
} from "react-icons/fa";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import "@/css/admin-dashboard.css";

const COLORS = ['#DB7C26', '#2e7d32', '#1565c0', '#e65100', '#f9a825', '#8e24aa', '#424242'];

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} role="tooltip">
        <p style={{ fontWeight: 'bold', margin: 0 }}>{label}</p>
        <p style={{ color: payload[0].color || '#333', margin: 0 }}>
          {`${payload[0].name}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

interface Reservation {
  id: string;
  date: string;
  timeSlot: string;
  formule: string;
  status: string;
  childName: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

interface ParkConfig {
  maintenanceMode: boolean;
  parkStatus: 'open' | 'closed' | 'maintenance';
  globalMessage: string;
  alertLevel: 'none' | 'info' | 'warning' | 'error';
  nextOpening: string;
  announcementBanner?: {
    enabled: boolean;
    dismissible: boolean;
    dismissalFrequency: 'session' | 'daily';
    displayMode: 'always' | 'scheduled';
    contentType: 'image' | 'text';
    text?: string;
    imageUrl?: string;
    startAt?: string;
    endAt?: string;
    version?: string;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, reservations: 0, activeProducts: 0 });
  const [chartsData, setChartsData] = useState<{
    usersGrowth: any[];
    reservationsTrend: any[];
    reservationsByFormula: any[];
    dailyReservations: any[];
  }>({ usersGrowth: [], reservationsTrend: [], reservationsByFormula: [], dailyReservations: [] });
  
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  const [parkConfig, setParkConfig] = useState<ParkConfig>({
    maintenanceMode: false,
    parkStatus: 'open',
    globalMessage: '',
    alertLevel: 'none',
    nextOpening: '',
    announcementBanner: {
      enabled: false,
      dismissible: true,
      dismissalFrequency: 'session',
      displayMode: 'always',
      contentType: 'image',
      text: '',
      imageUrl: '',
      startAt: '',
      endAt: '',
      version: '1'
    }
  });
  const [configLoading, setConfigLoading] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      // Fetch stats
      fetch('/api/admin/stats')
        .then(res => res.json())
        .then(data => { if (!data.error) setStats(data); })
        .catch(console.error);
        
      // Fetch charts
      fetch('/api/admin/charts')
        .then(res => res.json())
        .then(data => { if (!data.error) setChartsData(data); })
        .catch(console.error);

      // Fetch pending reservations
      fetch('/api/admin/reservations?status=pending')
        .then(res => res.json())
        .then(data => { if (data.reservations) setPendingReservations(data.reservations); })
        .catch(console.error);

      // Fetch config
      fetch('/api/admin/config')
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setParkConfig((prev) => ({
              ...prev,
              ...data,
              announcementBanner: {
                ...prev.announcementBanner,
                ...(data.announcementBanner ?? {})
              }
            }));
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const handleSaveConfig = async () => {
    setConfigLoading(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parkConfig)
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Configuration sauvegardée !' });
      } else {
        setFeedback({ type: 'error', message: 'Erreur lors de la sauvegarde.' });
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'Erreur technique.' });
    } finally {
      setConfigLoading(false);
    }
  };

  const handleUploadAnnouncementImage = async (file: File) => {
    setUploadingBanner(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok || !data?.url) {
        setFeedback({ type: 'error', message: 'Erreur upload image.' });
        return;
      }
      setParkConfig({
        ...parkConfig,
        announcementBanner: {
          ...(parkConfig.announcementBanner || {
            enabled: true,
            dismissible: true,
            dismissalFrequency: 'session',
            displayMode: 'always',
            contentType: 'image',
            text: '',
            imageUrl: '',
            startAt: '',
            endAt: '',
            version: '1'
          }),
          enabled: true,
          contentType: 'image',
          imageUrl: String(data.url),
        }
      });
      setFeedback({ type: 'success', message: 'Image uploadée. Pense à sauvegarder.' });
    } catch {
      setFeedback({ type: 'error', message: 'Erreur upload image.' });
    } finally {
      setUploadingBanner(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <main className="admin-container" role="alert">
        <Typography color="error" variant="h5" component="h1">Accès restreint.</Typography>
      </main>
    );
  }

  const modules = [
    { title: "Calendrier d'ouverture", description: "Gérer les jours d'ouverture.", icon: <FaCalendarAlt aria-hidden="true" />, link: "/admin/calendrier" },
    { title: "Horaires & Tarifs", description: "Gérer les tableaux d'horaires.", icon: <FaClock aria-hidden="true" />, link: "/admin/schedules" },
    { title: "Calendrier de l'Avent", description: "Gérer les surprises.", icon: <FaGift aria-hidden="true" />, link: "/admin/avent" },
    { title: "Gestion Utilisateurs", description: "Comptes et rôles.", icon: <FaUsers aria-hidden="true" />, link: "/admin/users" },
    { title: "Gestion Réservations", description: "Suivi et disponibilités.", icon: <FaTicketAlt aria-hidden="true" />, link: "/admin/reservations" },
    { title: "Gestion Événements", description: "Créer et gérer des événements.", icon: <FaCalendarAlt aria-hidden="true" />, link: "/admin/events" },
    { title: "Gestion Emails", description: "Campagnes et notifs.", icon: <FaEnvelope aria-hidden="true" />, link: "/admin/emails" }
  ];

  const statCards = [
    { title: "Utilisateurs", value: stats.users, icon: <FaUsers aria-hidden="true" />, type: "blue" },
    { title: "Réservations", value: stats.reservations, icon: <FaTicketAlt aria-hidden="true" />, type: "green" },
    { title: "Produits Actifs", value: stats.activeProducts, icon: <FaBoxOpen aria-hidden="true" />, type: "orange" },
  ];

  // Smart Todo Logic
  const urgentReservations = pendingReservations.filter(r => {
    const resDate = new Date(r.date);
    const today = new Date();
    // Consider "urgent" if date is passed or is today/tomorrow
    const diffTime = resDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 1; // Passed or within 1 day
  });

  return (
    <main className="admin-container">
      {/* Header Removed as requested */}

      {/* KPI Cards Section */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">Indicateurs Clés</h2>
        <div className="dashboard-grid grid-cols-kpi">
          {statCards.map((stat, index) => (
            <article key={index} className={`kpi-card ${stat.type}`}>
              <div>
                <div className="kpi-value">{stat.value}</div>
                <h3 className="kpi-label">{stat.title}</h3>
              </div>
              <div className="kpi-icon-wrapper">
                {stat.icon}
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Smart Todo Section */}
        <section className="card" style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e0e0e0' }}>
          <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaCheckCircle color="#DB7C26" /> À faire
          </h2>
          
          {pendingReservations.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>Rien à signaler ! 🎉</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {urgentReservations.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', color: '#c62828', marginBottom: '0.5rem' }}>Urgent / En retard</h3>
                  {urgentReservations.map(r => (
                    <Link href="/admin/reservations" key={r.id} style={{ textDecoration: 'none' }}>
                      <div style={{ padding: '0.75rem', background: '#ffebee', borderRadius: '8px', borderLeft: '4px solid #c62828', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 'bold', color: '#333' }}>{r.childName} - {new Date(r.date).toLocaleDateString('fr-FR')}</div>
                        <div style={{ fontSize: '0.85rem', color: '#c62828' }}>Date dépassée ou imminente</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {pendingReservations.length > urgentReservations.length && (
                <div>
                  <h3 style={{ fontSize: '1rem', color: '#ef6c00', marginBottom: '0.5rem' }}>En attente de confirmation</h3>
                  {pendingReservations.filter(r => !urgentReservations.includes(r)).slice(0, 5).map(r => (
                     <Link href="/admin/reservations" key={r.id} style={{ textDecoration: 'none' }}>
                      <div style={{ padding: '0.75rem', background: '#fff3e0', borderRadius: '8px', borderLeft: '4px solid #ef6c00', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 'bold', color: '#333' }}>{r.childName}</div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>{new Date(r.date).toLocaleDateString('fr-FR')} - {r.formule}</div>
                      </div>
                    </Link>
                  ))}
                  {pendingReservations.length - urgentReservations.length > 5 && (
                    <Link href="/admin/reservations" style={{ fontSize: '0.9rem', color: '#DB7C26' }}>
                      + {pendingReservations.length - urgentReservations.length - 5} autres...
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Park Config Section */}
        <section className="card" style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e0e0e0' }}>
          <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaExclamationCircle color="#2e7d32" /> Configuration du Parc
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={parkConfig.maintenanceMode}
                  onChange={(e) => setParkConfig({...parkConfig, maintenanceMode: e.target.checked})}
                  color="warning"
                />
              }
              label="Mode Maintenance (Site inaccessible)"
            />

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Statut du Parc</label>
              <Select
                fullWidth
                size="small"
                value={parkConfig.parkStatus}
                onChange={(e) => {
                  const newStatus = e.target.value as any;
                  // Auto-set message if closed/maintenance
                  let newMessage = parkConfig.globalMessage;
                  if (newStatus === 'closed') newMessage = "Fermeture exceptionnelle du parc aujourd'hui.";
                  if (newStatus === 'maintenance') newMessage = "Le site est actuellement en maintenance.";
                  if (newStatus === 'open') newMessage = "";
                  
                  setParkConfig({...parkConfig, parkStatus: newStatus, globalMessage: newMessage});
                }}
              >
                <MenuItem value="open">Ouvert (Normal)</MenuItem>
                <MenuItem value="closed">Fermé (Exceptionnel)</MenuItem>
                <MenuItem value="maintenance">Maintenance (Site inaccessible)</MenuItem>
              </Select>
            </div>

            {parkConfig.parkStatus === 'open' && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Message Global (Optionnel)</label>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Ex: Promo spéciale ce week-end..."
                  value={parkConfig.globalMessage}
                  onChange={(e) => setParkConfig({...parkConfig, globalMessage: e.target.value})}
                />
              </div>
            )}

            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<FaSave />}
              onClick={handleSaveConfig}
              disabled={configLoading}
              sx={{ alignSelf: 'flex-start', bgcolor: '#DB7C26', '&:hover': { bgcolor: '#B05A12' } }}
            >
              Sauvegarder
            </Button>
          </div>
        </section>

        {/* Announcements Section */}
        <section className="card" style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e0e0e0' }}>
          <h2 className="section-title" style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FaExclamationCircle color="#DB7C26" /> Annonces
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={!!parkConfig.announcementBanner?.enabled}
                  onChange={(e) =>
                    setParkConfig({
                      ...parkConfig,
                      announcementBanner: {
                        ...(parkConfig.announcementBanner || {
                          enabled: false,
                          dismissible: true,
                          dismissalFrequency: 'session',
                          displayMode: 'always',
                          contentType: 'image',
                          text: '',
                          imageUrl: '',
                          startAt: '',
                          endAt: '',
                          version: '1'
                        }),
                        enabled: e.target.checked
                      }
                    })
                  }
                  color="warning"
                />
              }
              label="Activer l'annonce (GlobalBanner)"
            />

            <Button
              variant="outlined"
              onClick={() => {
                const current = parkConfig.announcementBanner?.version ? String(parkConfig.announcementBanner.version) : '1';
                const n = Number.parseInt(current, 10);
                const next = Number.isFinite(n) ? String(n + 1) : String(Date.now());
                setParkConfig({
                  ...parkConfig,
                  announcementBanner: {
                    ...(parkConfig.announcementBanner || {
                      enabled: true,
                      dismissible: true,
                      dismissalFrequency: 'session',
                      displayMode: 'always',
                      contentType: 'image',
                      text: '',
                      imageUrl: '',
                      startAt: '',
                      endAt: '',
                      version: '1'
                    }),
                    enabled: true,
                    version: next,
                  }
                });
              }}
              sx={{ alignSelf: 'flex-start' }}
            >
              Forcer ré-affichage (bump version)
            </Button>

            <FormControlLabel
              control={
                <Switch
                  checked={parkConfig.announcementBanner?.dismissible !== false}
                  onChange={(e) =>
                    setParkConfig({
                      ...parkConfig,
                      announcementBanner: {
                        ...(parkConfig.announcementBanner || {
                          enabled: false,
                          dismissible: true,
                          dismissalFrequency: 'session',
                          displayMode: 'always',
                          contentType: 'image',
                          text: '',
                          imageUrl: '',
                          startAt: '',
                          endAt: '',
                          version: '1'
                        }),
                        dismissible: e.target.checked
                      }
                    })
                  }
                  color="warning"
                />
              }
              label="Peut être fermée par le visiteur"
            />

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Ré-affichage après fermeture</label>
              <Select
                fullWidth
                size="small"
                value={parkConfig.announcementBanner?.dismissalFrequency || 'session'}
                onChange={(e) =>
                  setParkConfig({
                    ...parkConfig,
                    announcementBanner: {
                      ...(parkConfig.announcementBanner || {
                        enabled: false,
                        dismissible: true,
                        dismissalFrequency: 'session',
                        displayMode: 'always',
                        contentType: 'image',
                        text: '',
                        imageUrl: '',
                        startAt: '',
                        endAt: '',
                        version: '1'
                      }),
                      dismissalFrequency: e.target.value as any,
                    }
                  })
                }
              >
                <MenuItem value="session">À chaque nouvelle visite</MenuItem>
                <MenuItem value="daily">Au maximum 1 fois par jour</MenuItem>
              </Select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Affichage</label>
              <Select
                fullWidth
                size="small"
                value={parkConfig.announcementBanner?.displayMode || 'always'}
                onChange={(e) =>
                  setParkConfig({
                    ...parkConfig,
                    announcementBanner: {
                      ...(parkConfig.announcementBanner || {
                        enabled: false,
                        dismissible: true,
                        dismissalFrequency: 'session',
                        displayMode: 'always',
                        contentType: 'image',
                        text: '',
                        imageUrl: '',
                        startAt: '',
                        endAt: '',
                        version: '1'
                      }),
                      displayMode: e.target.value as any
                    }
                  })
                }
              >
                <MenuItem value="always">Tout le temps</MenuItem>
                <MenuItem value="scheduled">Entre deux dates</MenuItem>
              </Select>
            </div>

            {parkConfig.announcementBanner?.displayMode === 'scheduled' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Début</label>
                  <TextField
                    fullWidth
                    size="small"
                    type="datetime-local"
                    value={parkConfig.announcementBanner?.startAt || ''}
                    onChange={(e) =>
                      setParkConfig({
                        ...parkConfig,
                        announcementBanner: {
                          ...(parkConfig.announcementBanner || {
                            enabled: false,
                            dismissible: true,
                            dismissalFrequency: 'session',
                            displayMode: 'always',
                            contentType: 'image',
                            text: '',
                            imageUrl: '',
                            startAt: '',
                            endAt: '',
                            version: '1'
                          }),
                          startAt: e.target.value
                        }
                      })
                    }
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Fin</label>
                  <TextField
                    fullWidth
                    size="small"
                    type="datetime-local"
                    value={parkConfig.announcementBanner?.endAt || ''}
                    onChange={(e) =>
                      setParkConfig({
                        ...parkConfig,
                        announcementBanner: {
                          ...(parkConfig.announcementBanner || {
                            enabled: false,
                            dismissible: true,
                            dismissalFrequency: 'session',
                            displayMode: 'always',
                            contentType: 'image',
                            text: '',
                            imageUrl: '',
                            startAt: '',
                            endAt: '',
                            version: '1'
                          }),
                          endAt: e.target.value
                        }
                      })
                    }
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Type</label>
              <Select
                fullWidth
                size="small"
                value={parkConfig.announcementBanner?.contentType || 'image'}
                onChange={(e) =>
                  setParkConfig({
                    ...parkConfig,
                    announcementBanner: {
                      ...(parkConfig.announcementBanner || {
                        enabled: false,
                        dismissible: true,
                        dismissalFrequency: 'session',
                        displayMode: 'always',
                        contentType: 'image',
                        text: '',
                        imageUrl: '',
                        startAt: '',
                        endAt: '',
                        version: '1'
                      }),
                      contentType: e.target.value as any
                    }
                  })
                }
              >
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="text">Texte</MenuItem>
              </Select>
            </div>

            {parkConfig.announcementBanner?.contentType === 'text' ? (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Texte</label>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  size="small"
                  placeholder="Ex: Promo spéciale ce week-end..."
                  value={parkConfig.announcementBanner?.text || ''}
                  onChange={(e) =>
                    setParkConfig({
                      ...parkConfig,
                      announcementBanner: {
                        ...(parkConfig.announcementBanner || {
                          enabled: false,
                          dismissible: true,
                          dismissalFrequency: 'session',
                          displayMode: 'always',
                          contentType: 'image',
                          text: '',
                          imageUrl: '',
                          startAt: '',
                          endAt: '',
                          version: '1'
                        }),
                        text: e.target.value
                      }
                    })
                  }
                />
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>URL image</label>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="/images/flyers/fermeture.png ou https://..."
                  value={parkConfig.announcementBanner?.imageUrl || ''}
                  onChange={(e) =>
                    setParkConfig({
                      ...parkConfig,
                      announcementBanner: {
                        ...(parkConfig.announcementBanner || {
                          enabled: false,
                          dismissible: true,
                          dismissalFrequency: 'session',
                          displayMode: 'always',
                          contentType: 'image',
                          text: '',
                          imageUrl: '',
                          startAt: '',
                          endAt: '',
                          version: '1'
                        }),
                        imageUrl: e.target.value
                      }
                    })
                  }
                />

                <div style={{ marginTop: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Uploader une image</label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingBanner}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleUploadAnnouncementImage(f);
                      e.currentTarget.value = '';
                    }}
                  />
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                    L'image sera enregistrée dans <code>/public/uploads</code> et l'URL sera remplie automatiquement.
                  </div>
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>Version (pour ré-afficher après fermeture)</label>
              <TextField
                fullWidth
                size="small"
                placeholder="Ex: 2"
                value={parkConfig.announcementBanner?.version || '1'}
                onChange={(e) =>
                  setParkConfig({
                    ...parkConfig,
                    announcementBanner: {
                      ...(parkConfig.announcementBanner || {
                        enabled: false,
                        dismissible: true,
                        dismissalFrequency: 'session',
                        displayMode: 'always',
                        contentType: 'image',
                        text: '',
                        imageUrl: '',
                        startAt: '',
                        endAt: '',
                        version: '1'
                      }),
                      version: e.target.value
                    }
                  })
                }
              />
            </div>

            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<FaSave />}
              onClick={handleSaveConfig}
              disabled={configLoading}
              sx={{ alignSelf: 'flex-start', bgcolor: '#DB7C26', '&:hover': { bgcolor: '#B05A12' } }}
            >
              Sauvegarder l'annonce
            </Button>
          </div>
        </section>
      </div>

      {/* Charts Section */}
      <section aria-labelledby="charts-heading" style={{ marginTop: '3rem' }}>
        <h2 id="charts-heading" className="section-title">
          Analyses & Tendances
        </h2>
        
        <div className="dashboard-grid grid-cols-charts">
          
          {/* Chart 4: Daily Reservations (Line Chart) - NEW */}
          <article className="chart-card">
            <h3 className="chart-title">Réservations (30 derniers jours)</h3>
            <p className="chart-subtitle">Activité quotidienne</p>
            <Box height={300} width="100%">
              <ResponsiveContainer>
                <LineChart data={chartsData.dailyReservations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#555" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#2e7d32" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#2e7d32' }}
                    activeDot={{ r: 6 }}
                    name="Réservations"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </article>

          {/* Chart 1: Users Growth (Area Chart) */}
          <article className="chart-card">
            <h3 className="chart-title">Croissance des Utilisateurs</h3>
            <p className="chart-subtitle">12 derniers mois</p>
            <Box height={300} width="100%">
              <ResponsiveContainer>
                <AreaChart data={chartsData.usersGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DB7C26" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#DB7C26" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#555" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}/${year.slice(2)}`;
                    }}
                  />
                  <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#DB7C26" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                    name="Utilisateurs"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </article>

          {/* Chart 2: Reservations Trend (Bar Chart) */}
          <article className="chart-card">
            <h3 className="chart-title">Volume des Réservations</h3>
            <p className="chart-subtitle">12 derniers mois</p>
            <Box height={300} width="100%">
              <ResponsiveContainer>
                <BarChart data={chartsData.reservationsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#555" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${month}/${year.slice(2)}`;
                    }}
                  />
                  <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#2e7d32" radius={[4, 4, 0, 0]} name="Réservations" barSize={40}>
                    {chartsData.reservationsTrend.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#2e7d32' : '#e0e0e0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </article>

          {/* Chart 3: Formula Distribution (Pie Chart) */}
          <article className="chart-card">
            <h3 className="chart-title">Répartition par Formule</h3>
            <p className="chart-subtitle">Toutes périodes</p>
            <Box height={300} width="100%">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartsData.reservationsByFormula}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    stroke="white"
                    strokeWidth={2}
                    isAnimationActive={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return percent > 0.05 ? (
                        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      ) : null;
                    }}
                  >
                    {chartsData.reservationsByFormula.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={72} 
                    iconType="circle"
                    iconSize={10}
                    wrapperStyle={{ fontSize: '12px', overflowY: 'auto', paddingBottom: '10px', color: '#333' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </article>

        </div>
      </section>

      {/* Modules Section */}
      <section aria-labelledby="modules-heading">
        <h2 id="modules-heading" className="section-title">
          Modules de gestion
        </h2>

        <div className="dashboard-grid grid-cols-modules">
          {modules.map((module, index) => (
            <Link key={index} href={module.link} className="module-card">
              <article className="module-content">
                <div className="module-icon" style={{ color: index % 2 === 0 ? '#DB7C26' : '#2e7d32' }}>
                  {module.icon}
                </div>
                <h3 className="module-title">
                  {module.title}
                </h3>
                <p className="module-description">
                  {module.description}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <Snackbar
        open={!!feedback}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setFeedback(null)} severity={feedback?.type || 'info'} sx={{ width: '100%' }}>
          {feedback?.message}
        </Alert>
      </Snackbar>
    </main>
  );
}
