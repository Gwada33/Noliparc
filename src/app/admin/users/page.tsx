"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUserShield, FaUser, FaTimes } from 'react-icons/fa';
import '@/css/admin-dashboard.css';

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  createdAt: string;
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'user'
  });

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      // redirect handled by layout or check
      return;
    }
    fetchUsers();
  }, [currentUser, search]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/admin/users?search=${search}`);
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingUser 
        ? `/api/admin/users/${editingUser.id}` 
        : '/api/admin/users';
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setShowModal(false);
        setEditingUser(null);
        setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'user' });
        fetchUsers();
      } else {
        alert("Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Error saving user", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '', // Don't fill password
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      role: user.role
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '', role: 'user' });
    setShowModal(true);
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return <div className="admin-container">Accès refusé</div>;
  }

  return (
    <main className="admin-container">
      <div className="section-title" style={{ justifyContent: 'space-between' }}>
        <span>Gestion des Utilisateurs</span>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FaPlus aria-hidden="true" /> Ajouter
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <FaSearch className="search-icon" aria-hidden="true" />
        <input
          type="text"
          className="form-control search-input"
          placeholder="Rechercher un utilisateur..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Rechercher un utilisateur"
        />
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">Utilisateur</th>
              <th scope="col">Contact</th>
              <th scope="col">Rôle</th>
              <th scope="col">Date d'inscription</th>
              <th scope="col" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div style={{ fontWeight: 'bold' }}>{user.firstName} {user.lastName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{user.email}</div>
                </td>
                <td>{user.phone || '-'}</td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                    {user.role === 'admin' ? <FaUserShield aria-hidden="true" /> : <FaUser aria-hidden="true" />}
                    {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                  </span>
                </td>
                <td>
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    className="btn-icon" 
                    onClick={() => openEditModal(user)}
                    aria-label={`Modifier ${user.firstName} ${user.lastName}`}
                  >
                    <FaEdit size={18} aria-hidden="true" />
                  </button>
                  <button 
                    className="btn-icon" 
                    onClick={() => handleDelete(user.id)}
                    style={{ color: '#c62828' }}
                    aria-label={`Supprimer ${user.firstName} ${user.lastName}`}
                  >
                    <FaTrash size={18} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="modal-title" className="modal-title">
                {editingUser ? 'Modifier' : 'Ajouter'} un utilisateur
              </h2>
              <button 
                className="modal-close" 
                onClick={() => setShowModal(false)}
                aria-label="Fermer"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="firstName" className="sr-only">Prénom</label>
                  <input
                    id="firstName"
                    type="text"
                    className="form-control"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={e => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName" className="sr-only">Nom</label>
                  <input
                    id="lastName"
                    type="text"
                    className="form-control"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={e => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="sr-only">Téléphone</label>
                <input
                  id="phone"
                  type="tel"
                  className="form-control"
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="role" className="sr-only">Rôle</label>
                <select
                  id="role"
                  className="form-control"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              
              {!editingUser && (
                <div className="form-group">
                  <label htmlFor="password_new" className="sr-only">Mot de passe</label>
                  <input
                    id="password_new"
                    type="password"
                    className="form-control"
                    placeholder="Mot de passe"
                    required
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              )}
              {editingUser && (
                <div className="form-group">
                  <label htmlFor="password_edit" className="sr-only">Nouveau mot de passe</label>
                  <input
                    id="password_edit"
                    type="password"
                    className="form-control"
                    placeholder="Nouveau mot de passe (optionnel)"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
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
