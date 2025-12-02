'use client';

import React, { useState, useEffect } from 'react';

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

interface EventFormProps {
  event?: Event | {};
  onSave: (event: Event) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Event>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: '',
    capacity: undefined,
    price: undefined,
    category: '',
    status: 'upcoming',
    visibility: 'active',
    ...event,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Event, string>>>({});

  useEffect(() => {
    if (event) {
      setFormData({ ...event } as Event);
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        image: '',
        capacity: undefined,
        price: undefined,
        category: '',
        status: 'upcoming',
        visibility: 'active',
      });
    }
  }, [event]);

  const validate = () => {
    const newErrors: Partial<Record<keyof Event, string>> = {};
    if (!formData.title) newErrors.title = "Le titre est obligatoire.";
    if (!formData.description) newErrors.description = "La description est obligatoire.";
    if (!formData.date) newErrors.date = "La date est obligatoire.";
    if (!formData.location) newErrors.location = "Le lieu est obligatoire.";
    if (formData.capacity && formData.capacity < 1) newErrors.capacity = "La capacité maximale doit être un nombre positif.";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof Event]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Titre" />
        {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
      </div>
      <div>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
        {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
      </div>
      <div>
        <input type="date" name="date" value={formData.date} onChange={handleChange} />
        {errors.date && <span style={{ color: 'red' }}>{errors.date}</span>}
      </div>
      <div>
        <input type="time" name="time" value={formData.time || ''} onChange={handleChange} />
      </div>
      <div>
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Lieu" />
        {errors.location && <span style={{ color: 'red' }}>{errors.location}</span>}
      </div>
      <div>
        <input name="image" value={formData.image || ''} onChange={handleChange} placeholder="URL de l'image" />
      </div>
      <div>
        <input type="number" name="capacity" value={formData.capacity as any} onChange={handleChange} placeholder="Capacité maximale" />
        {errors.capacity && <span style={{ color: 'red' }}>{errors.capacity}</span>}
      </div>
      <div>
        <input type="number" step="0.01" name="price" value={formData.price as any} onChange={handleChange} placeholder="Prix (€)" />
      </div>
      <div>
        <input name="category" value={formData.category} onChange={handleChange} placeholder="Catégorie" />
      </div>
      <div>
        <input name="status" value={formData.status || ''} onChange={handleChange} placeholder="Statut (upcoming/past/cancelled)" />
      </div>
      <div>
        <input name="visibility" value={formData.visibility || ''} onChange={handleChange} placeholder="Visibilité (active/hidden)" />
      </div>
      <button type="submit">Enregistrer</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>Annuler</button>
    </form>
  );
};

export default EventForm;
