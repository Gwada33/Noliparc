# Documentation Technique - Administration Noliparc

Ce document détaille l'architecture et le fonctionnement des modules d'administration développés pour la plateforme Noliparc.

## 1. Vue d'ensemble

L'interface d'administration a été refondue pour offrir une meilleure expérience utilisateur (UX), une cohérence visuelle (UI) et des fonctionnalités de gestion avancées.

**Points clés :**
- **Design System :** Utilisation de variables CSS et de classes utilitaires (`admin-dashboard.css`) pour une maintenance aisée et un rendu performant.
- **Architecture Modulaire :** Séparation claire des responsabilités (Users, Emails, Reservations).
- **Sécurité :** Protection des routes API via vérification du rôle `admin` dans les tokens JWT.
- **Traçabilité :** Système de logs (`activity_logs`) pour toutes les actions critiques.

## 2. Modules de Gestion

### 2.1. Gestion des Utilisateurs

**Fonctionnalités :**
- Liste paginée et recherche (nom, email).
- Création de comptes (admin ou user).
- Modification des informations et rôles.
- Suppression de comptes.

**API Endpoints (`/api/admin/users`) :**
- `GET /` : Liste des utilisateurs (params: limit, offset, search).
- `POST /` : Création d'un utilisateur.
- `PUT /:id` : Mise à jour d'un utilisateur.
- `DELETE /:id` : Suppression d'un utilisateur.

### 2.2. Gestion des Réservations

**Fonctionnalités :**
- Vue d'ensemble des demandes (Anniversaires, etc.).
- Filtrage par statut (en attente, confirmée, annulée).
- Détails complets (enfant, gâteau, extras).
- Actions rapides : Confirmer / Refuser.

**API Endpoints (`/api/admin/reservations`) :**
- `GET /` : Liste des réservations (filtres: status, date, search).
- `PUT /:id` : Modification du statut.
- `DELETE /:id` : Suppression.

### 2.3. Gestion des Emails

**Fonctionnalités :**
- **Envoi manuel :** Interface de composition avec support HTML.
- **Modèles (Templates) :** Gestion CRUD de modèles d'emails réutilisables.
- **Historique :** Suivi des envois (succès/échec).

**API Endpoints (`/api/admin/emails`) :**
- `POST /` : Envoi d'un email (immédiat).
- `GET /` : Historique des envois.
- `GET /templates` : Liste des modèles.
- `POST /templates` : Création d'un modèle.
- `PUT /templates/:id` : Mise à jour.
- `DELETE /templates/:id` : Suppression.

## 3. Base de Données

Les nouvelles tables suivantes ont été ajoutées au schéma PostgreSQL :

```sql
-- Modèles d'emails
CREATE TABLE email_templates (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE, -- Identifiant unique pour usage programmatique (ex: 'welcome')
  name TEXT,
  subject TEXT,
  html TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Historique des emails
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT,
  template_id INTEGER REFERENCES email_templates(id),
  status TEXT DEFAULT 'sent', -- 'sent', 'failed'
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Logs d'activité
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id),
  action TEXT NOT NULL, -- ex: 'CREATE_USER', 'UPDATE_RESERVATION'
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 4. Sécurité & Logs

### Authentification
Toutes les routes `/api/admin/*` vérifient la présence d'un cookie `accessToken` valide contenant un payload JWT avec `role: 'admin'`.

### Journalisation
Le module `lib/logger.ts` expose la fonction `logActivity`. Elle est invoquée automatiquement lors des opérations d'écriture (POST, PUT, DELETE) sur les modules d'administration.

**Exemple d'utilisation :**
```typescript
await logActivity(adminId, "UPDATE_USER", { userId: targetId, changes: body });
```

## 5. Styles & Frontend

Le fichier `src/css/admin-dashboard.css` centralise les styles :
- **Grilles CSS** pour la mise en page responsive.
- **Cartes KPI** avec indicateurs visuels (bordures colorées).
- **Tableaux** épurés pour la lisibilité des données.
- **Modales** pour les formulaires d'édition sans quitter la page.

Les composants MUI (Material UI) ont été remplacés par des éléments natifs stylisés pour améliorer les performances et la maintenabilité.
