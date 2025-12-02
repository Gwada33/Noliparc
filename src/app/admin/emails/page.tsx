"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { FaPaperPlane, FaHistory, FaFileAlt, FaPlus, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import '@/css/admin-dashboard.css';

export default function EmailsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('compose');
  
  // Compose State
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [sending, setSending] = useState(false);

  // History State
  const [history, setHistory] = useState<any[]>([]);
  
  // Templates State
  const [templates, setTemplates] = useState<any[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateForm, setTemplateForm] = useState({ name: '', key: '', subject: '', content: '' });

  useEffect(() => {
    if (user?.role !== 'admin') return;
    if (activeTab === 'history') fetchHistory();
    if (activeTab === 'templates' || activeTab === 'compose') fetchTemplates();
  }, [user, activeTab]);

  const fetchHistory = async () => {
    const res = await fetch('/api/admin/emails?limit=20');
    const data = await res.json();
    if (data.emails) setHistory(data.emails);
  };

  const fetchTemplates = async () => {
    const res = await fetch('/api/admin/emails/templates');
    const data = await res.json();
    if (data.templates) setTemplates(data.templates);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/admin/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, content, templateId: selectedTemplate || null })
      });
      if (res.ok) {
        alert('Email envoyé !');
        setTo('');
        setSubject('');
        setContent('');
        setSelectedTemplate('');
      } else {
        alert("Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tmplId = e.target.value;
    setSelectedTemplate(tmplId);
    if (tmplId) {
      const tmpl = templates.find(t => t.id.toString() === tmplId);
      if (tmpl) {
        setSubject(tmpl.subject);
        setContent(tmpl.html);
      }
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTemplate 
        ? `/api/admin/emails/templates/${editingTemplate.id}` 
        : '/api/admin/emails/templates';
      const method = editingTemplate ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateForm)
      });

      if (res.ok) {
        setShowTemplateModal(false);
        setEditingTemplate(null);
        setTemplateForm({ name: '', key: '', subject: '', content: '' });
        fetchTemplates();
      } else {
        alert("Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openEditTemplate = (tmpl: any) => {
    setEditingTemplate(tmpl);
    setTemplateForm({ name: tmpl.name, key: tmpl.key, subject: tmpl.subject, content: tmpl.html });
    setShowTemplateModal(true);
  };
  
  const openNewTemplate = () => {
    setEditingTemplate(null);
    setTemplateForm({ name: '', key: '', subject: '', content: '' });
    setShowTemplateModal(true);
  };

  const deleteTemplate = async (id: string) => {
    if(!confirm("Supprimer ce modèle ?")) return;
    await fetch(`/api/admin/emails/templates/${id}`, { method: 'DELETE' });
    fetchTemplates();
  };

  if (!user || user.role !== 'admin') return <div className="admin-container">Accès refusé</div>;

  return (
    <main className="admin-container">
      <div className="section-title">Gestion des Emails</div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveTab('compose')}
          style={{ 
            padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: activeTab === 'compose' ? '#DB7C26' : 'transparent',
            color: activeTab === 'compose' ? 'white' : '#666',
            fontWeight: activeTab === 'compose' ? 'bold' : 'normal',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <FaPaperPlane /> Nouveau Message
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          style={{ 
            padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: activeTab === 'history' ? '#DB7C26' : 'transparent',
            color: activeTab === 'history' ? 'white' : '#666',
            fontWeight: activeTab === 'history' ? 'bold' : 'normal',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <FaHistory /> Historique
        </button>
        <button 
          onClick={() => setActiveTab('templates')}
          style={{ 
            padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
            background: activeTab === 'templates' ? '#DB7C26' : 'transparent',
            color: activeTab === 'templates' ? 'white' : '#666',
            fontWeight: activeTab === 'templates' ? 'bold' : 'normal',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <FaFileAlt /> Modèles
        </button>
      </div>

      {/* COMPOSE TAB */}
      {activeTab === 'compose' && (
        <div className="card" style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Modèle (Optionnel)</label>
              <select 
                value={selectedTemplate} 
                onChange={handleTemplateSelect}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="">Sélectionner un modèle...</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Destinataire (Email)</label>
              <input 
                type="email" 
                required 
                value={to}
                onChange={e => setTo(e.target.value)}
                placeholder="client@exemple.com"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Sujet</label>
              <input 
                type="text" 
                required 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Sujet de l'email"
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contenu (HTML)</label>
              <textarea 
                required 
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={10}
                placeholder="Bonjour,<br/><br/>..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'monospace' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={sending}
              style={{ 
                padding: '1rem', borderRadius: '8px', border: 'none', 
                background: sending ? '#ccc' : '#DB7C26', color: 'white', fontWeight: 'bold',
                cursor: sending ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}
            >
              <FaPaperPlane /> {sending ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </form>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="card" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Destinataire</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Sujet</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Ouvert</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Clics</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {history.map(email => (
                <tr key={email.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>{new Date(email.created_at).toLocaleString('fr-FR')}</td>
                  <td style={{ padding: '1rem' }}>{email.recipient}</td>
                  <td style={{ padding: '1rem' }}>{email.subject}</td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {email.opened_at ? (
                      <span title={new Date(email.opened_at).toLocaleString()} style={{ color: '#2e7d32', fontWeight: 'bold' }}>Oui</span>
                    ) : (
                      <span style={{ color: '#ccc' }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {email.click_count > 0 ? (
                      <span style={{ fontWeight: 'bold', color: '#DB7C26' }}>{email.click_count}</span>
                    ) : (
                      <span style={{ color: '#ccc' }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem',
                      background: email.status === 'sent' ? '#e8f5e9' : '#ffebee',
                      color: email.status === 'sent' ? '#2e7d32' : '#c62828'
                    }}>
                      {email.status === 'sent' ? 'Envoyé' : 'Échec'}
                    </span>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Aucun historique</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TEMPLATES TAB */}
      {activeTab === 'templates' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button onClick={openNewTemplate} style={{ 
              padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', 
              background: '#DB7C26', color: 'white', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <FaPlus /> Nouveau Modèle
            </button>
          </div>

          <div className="dashboard-grid grid-cols-modules">
            {templates.map(tmpl => (
              <div key={tmpl.id} className="kpi-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{tmpl.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#666', background: '#f5f5f5', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-block' }}>
                      Clé: {tmpl.key}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEditTemplate(tmpl)} style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer' }}><FaEdit /></button>
                    <button onClick={() => deleteTemplate(tmpl.id)} style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}><FaTrash /></button>
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#444' }}>
                  <strong>Sujet:</strong> {tmpl.subject}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '800px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0 }}>{editingTemplate ? 'Modifier le modèle' : 'Nouveau modèle'}</h2>
            <form onSubmit={handleSaveTemplate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nom (Admin)</label>
                  <input 
                    type="text" required value={templateForm.name}
                    onChange={e => setTemplateForm({...templateForm, name: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Clé unique (ex: welcome_email)</label>
                  <input 
                    type="text" required value={templateForm.key}
                    onChange={e => setTemplateForm({...templateForm, key: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Sujet</label>
                <input 
                  type="text" required value={templateForm.subject}
                  onChange={e => setTemplateForm({...templateForm, subject: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Contenu HTML</label>
                <textarea 
                  required value={templateForm.content}
                  onChange={e => setTemplateForm({...templateForm, content: e.target.value})}
                  rows={12}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowTemplateModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: '#DB7C26', color: 'white', cursor: 'pointer' }}>
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
