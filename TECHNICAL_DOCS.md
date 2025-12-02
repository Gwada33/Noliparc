# Documentation Technique Noliparc

## Vue d'ensemble
Noliparc est une application web de gestion pour un parc de loisirs, construite avec **Next.js 15 (App Router)** et **Supabase (PostgreSQL)**. Elle inclut une interface publique pour les réservations et un tableau de bord administrateur complet.

## Architecture

### Stack Technique
- **Frontend**: React, Next.js 15, CSS Modules/Global CSS (Grid/Flexbox).
- **Backend**: Next.js API Routes (Node.js runtime).
- **Base de données**: Supabase (PostgreSQL).
- **Authentification**: JWT (JSON Web Tokens) stockés dans les cookies (`accessToken`).
- **Email**: Nodemailer avec suivi (pixel tracking & lien de redirection).

### Structure des Dossiers
- `src/app`: Pages et routes API (App Router).
  - `admin`: Interface d'administration sécurisée.
  - `api`: Endpoints REST.
- `src/lib`: Utilitaires (connexion DB, logger, email helper, JWT).
- `src/components`: Composants React réutilisables.
- `src/css`: Styles globaux et spécifiques (ex: `admin-dashboard.css`).

## Modules de Gestion

### 1. Gestion des Utilisateurs
- **Table**: `users`
- **Fonctionnalités**:
  - Création, modification, suppression.
  - Rôles (`admin`, `user`).
  - API: `/api/admin/users`

### 2. Gestion des Réservations
- **Table**: `reservations`
- **Fonctionnalités**:
  - Calendrier interactif avec vue mensuelle.
  - Liste filtrable par statut/recherche.
  - Gestion des disponibilités (Table `availability`).
  - API: `/api/admin/reservations`, `/api/admin/availability`.
  - Notifications: Rappels automatiques J-1 via Cron.

### 3. Gestion des Emails
- **Table**: `emails` (Logs d'envoi)
- **Fonctionnalités**:
  - Envoi d'emails transactionnels et marketing.
  - Templates HTML.
  - Suivi des ouvertures (Pixel invisible) et clics.
  - API: `/api/admin/emails`, `/api/tracking/*`.

## Sécurité

### Authentification
- Middleware `checkAdmin` pour protéger les routes API administrateur.
- Validation JWT stricte.
- Cookies HttpOnly pour prévenir les attaques XSS.

### Logs d'Activité
- **Table**: `activity_logs`
- Chaque action critique (écriture/suppression) est loggée avec l'ID de l'utilisateur, l'action, et les détails JSON.

## Tâches Automatisées (Cron)
- **Route**: `/api/cron/reminders`
- **Fréquence recommandée**: Quotidienne (ex: 09:00).
- Envoie un email de rappel pour les réservations confirmées du lendemain.
- Met à jour la colonne `reminder_sent_at` pour éviter les doublons.

## Tests
- Framework: **Vitest** + React Testing Library.
- Configuration: `vitest.config.ts`.
- Commandes: `npm test`.

## Déploiement
- Compatible avec Vercel.
- Variables d'environnement requises:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `EMAIL_USER`, `EMAIL_PASS`
  - `NEXT_PUBLIC_BASE_URL`
