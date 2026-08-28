# 🎯 Plan d'améliorations — Noliparc

> Objectif : rendre le site **plus lisible, plus concis, plus cohérent** et mieux agencé, pour améliorer l'expérience utilisateur et la conversion (réservations, inscriptions).
> Ce document est un **audit + plan d'action priorisé**. Chaque action indique son **impact** et son **effort** pour planifier sereinement.

---

## 1. Synthèse — ce qu'il faut retenir

| Chantier | Enjeu | Priorité |
| --- | --- | --- |
| **Clarté & agencement** | Harmonie des sections, hiérarchie visuelle, moins de texte | **P0** |
| **Parcours de réservation** | Le tunnel anniversaire = cœur business : le rendre simple et rassurant | **P0** |
| **Performance** | Le LCP (côté mobile) est menacé par les vidéos du hero et les galeries lourdes | **P0** |
| **SEO** | Sitemap/config, balises, contenu indexable | **P1** |
| **Accessibilité** | Contraste, focus, lecture d'écran | **P1** |
| **Admin** | Ergonomie tableaux (pagination, export) | **P2** |

**Légende** : P0 = à faire rapidement (impact fort) · P1 = important · P2 = bonus.
Effort : S (≤ 2h) · M (1/2 journée) · L (1 jour+) · XL (plusieurs jours).

---

## 2. Constats & actions par zone

### 2.1 Navigation & structure (architecture de l'information)

| Constat | Problème | Action | Prio/Effort |
| --- | --- | --- | --- |
| La navbar n'a que 3 liens : Nolijump, Noliparc, Anniversaires | Snack, Quads, Calendrier & Tarifs sont invisibles → clics perdus | Ajouter "Snack 🍔", "Quads 🏍️", "Calendrier 🗓️" + un CTA **"Réserver"** permanent (orange) | P0 / M |
| Les utilisateurs ne savent pas où réserver | "Réserver" n'existe que dans les cartes formules | Bouton "Réserver" dans la navbar → `/anniversaires` pour tout le monde (le tunnel s'adapte à la formule) | P0 / S |
| Pas de page 404 | Lien cassé = page blanche par défaut, navigation perdue | Créer `app/not-found.tsx` avec logo + liens utiles + recherche | P1 / S |
| Liens "Noliparc" → `/` et "Anniversaires" → `/anniversaires` ; aucune ancre vers les sections de la home | Difficile de revenir à "Tarifs" ou "Règlement" | Dans le footer et la home, ajouter des liens d'ancres (`#tarifs`, `#reglement`, `#horaires`) | P2 / S |
| Le footer logotypes est correct | — | Ajouter une colonne "Horaires simplifiés" (lu, ma, me…) + téléphone en gros + bouton "Réserver" | P1 / M |

### 2.2 Page d'accueil

| Constat | Problème | Action | Prio/Effort |
| --- | --- | --- | --- |
| Le hero est un carrousel de **2 vidéos externes (archive.org)** | Grosses vidéos = LCP lent sur mobile + dépendance externe + pas de sous-titres | 1) Passer la 1ʳᵉ slide en **image avec poster** (vidéo uniquement au clic ou sur desktop) ; 2) compresser les vidéos ; 3) `preload="metadata"` | P0 / L |
| Les **horaires s'affichent juste après le hero** | Un visiteur ne cherche pas les horaires en premier → désordre | Réordonner la home : hero → **bandeau "infos clés"** (ouvert ? adresse ?) → activités → tarifs → horaires → galerie → règles/map | P0 / M |
| La section "Tarifs" mélange une liste et des cartes Pass | Deux systèmes de lecture dans la même section | Uniformiser : les tarifs d'entrée en **cartes** (comme Nolijump), les Pass mis en avant dans une ligne "Pass & abonnements" | P1 / M |
| Le "Règlement intérieur" = **12 règles en liste à puces** | Long et rebutant ; l'information clé (chaussettes, nourriture) est noyée | Ne garder que les **5 règles essentielles** + lien "Voir le règlement complet (PDF)". Mettre l'avertissement "chaussettes" en badge coloré | P1 / S |
| Les paragraphes des features (4 blocs) sont très longs | Texte massif = non scanné | Réécrire en **2-3 phrases + 3 puces clés** ; ajouter un lien "En savoir plus" | P1 / M |
| Section événements conditionnelle | OK si remplie | La mettre juste après "Tarifs" et avant "Règlement" | P2 / S |
| Le badge "Ouvert/Fermé" a été retiré | Les visiteurs ne savent pas si c'est ouvert | Le remettre, intégré à la carte "Horaires" avec le **horaire du jour** (donnée `/api/schedules`) — sans Google API | P2 / M |

### 2.3 Page Nolijump

| Constat | Problème | Action | Prio/Effort |
| --- | --- | --- | --- |
| La galerie contient **27 photos** en carrousel | Poids + longueur de page ; peu de visibilité | Passer à une **grille de 6-8 photos choisies** + lien "Voir la galerie complète" (page dédiée) ; garder le fullscreen au clic | P0 / M |
| La section "Tarifs" : 6 cartes alignées | OK mais les cartes "Offre Étudiant" et "Chaussettes" alourdissent la lecture | Regrouper : 4 formules principales + bloc "Infos pratiques" (chaussettes, étudiant, pass) en encart | P1 / M |
| Le hero (logo + titre + CTA) est mieux | — | Ajouter un **lien d'ancre "Activités"** et une photo d'ambiance en arrière-plan très légère (blur) | P2 / M |
| Les horaires sont 2 tableaux "miroirs" | Redondance vacances/scolaire | Ajouter un **onglet "Vacances / Période scolaire"** au lieu de deux tableaux | P2 / M |
| La page manque de preuve sociale | — | Ajouter une ligne "⭐ Ils ont fêté leur anniversaire ici" (3 avis + lien) | P2 / S |

### 2.4 Anniversaires & parcours de réservation

| Constat | Problème | Action | Prio/Effort |
| --- | --- | --- | --- |
| La page liste a bien été retravaillée (hero + Golden) | — | Compléter : badge "Populaire" sur une formule par grille + icônes lisibles | P1 / S |
| L'info clé (acompte 50 %, chaussettes) est en **bas de page** (`.notice`) | Les gens la découvrent après lecture | La déplacer en **encart coloré en haut**, sous le hero | P1 / S |
| Le tunnel de réservation (`/anniversaires/reserver`) a **6 étapes** avec beaucoup de champs | Risque d'abandon ; certaines étapes peuvent fusionner | 1) Fusionner "Infos enfant" + "Participants" (2 écrans → 1) ; 2) afficher un **récapitulatif sticky** (formule + prix) sur mobile ; 3) préremplir depuis le `?formule=` (déjà partiel) | P0 / L |
| Les formulaires n'indiquent pas le **prix total estimé** | Plusieurs formules sont "x €/enfant (min. N)" → le visiteur ne sait pas combien il paiera | Ajouter un estimateur temps réel : nombre d'enfants × prix + privatisation | P0 / M |
| Pas de calcul du **nombre minimum d'enfants** | Erreurs de saisie | Blocage actif avec message "Minimum X enfants pour cette formule" | P0 / S |
| Les chaussettes (5€ / 8,99€) ne sont pas proposées dans le tunnel | Opportunité de vente + besoin réel | Ajouter une **option "Ajouter des chaussettes"** (quantité enfant/adulte) au step gâteau/extras | P1 / M |
| La confirmation est un modal | Facile à perdre | Page de confirmation dédiée : récap + numéro de réservation + "ajouter à mon agenda" | P2 / M |

### 2.5 Pages Snack / Quad / Preview / Calendrier

| Constat | Problème | Action | Prio/Effort |
| --- | --- | --- | --- |
| Snack : 4 lignes "Bonbon" à des prix différents (0,30 à 1,30 €) | Incompréhensible : le client choisit quoi ? | Libellés clairs : "Bonbon (sachet petit/moyen/grand)" ou regrouper en "Bonbons — 0,30 à 1,30 €" | P0 / S |
| Snack : pas d'image d'ambiance | Page plate | Petit bandeau header avec l'image transparente + rappel "Disponible à la caisse toute la journée" | P2 / S |
| Quad/Preview : galerie pleine largeur | OK | Ajouter un CTA "Réserver votre anniversaire" en bas de ces pages | P2 / S |
| Calendrier : page centrée sur décembre | Contenu figé | Permettre la **navigation mois par mois** (comme l'admin) | P1 / M |
| "Images de Quad" corrigé | ✅ | — | — |

### 2.6 Authentification (login / inscription)

| Constat | Problème | Action | Prio/Effort |
| --- | --- | --- | --- |
| L'écran est OK (carte centrée, logo) | — | Ajouter le **lien "Mot de passe oublié"** déjà présent ✅ ; ajouter une **note de sécu** ("vos données restent confidentielles") | P2 / S |
| Inscription : beaucoup de champs (prénom, nom, email, password, tel, captcha, CGU) | Long | 1) Mettre "Nom" et "Prénom" sur une ligne ✅ ; 2) rendre le téléphone optionnel si les réservations peuvent se faire par email | P1 / S |
| Captcha fixé (espacement + responsive) | ✅ | Vérifier le contraste du "link" MUI (ok avec le thème) | P2 / S |

### 2.7 Footer & mentions légales

| Constat | Problème | Action | Prio/Effort |
| --- | --- | --- | --- |
| Footer : 2 colonnes (texte + logos) | OK | Y ajouter : horaires du jour, téléphone cliquable (`tel:`), bouton Réserver | P1 / M |
| Pages légales : longs blocs de texte | Difficiles à lire | Ajouter un **sommaire avec ancres** en haut + détails repliables (`<details>`) | P2 / M |
| La "Décharge de responsabilité" est un lien PDF externe | OK | L'ajouter aussi comme **lien dans le footer** (au lieu du seul lien dans le règlement) | P2 / S |

### 2.8 Accessibilité

| Constat | Problème | Action | Prio/Effort |
| --- | --- | --- | --- |
| Pas de lien "Aller au contenu" | Lecteur d'écran = relecture de la nav | Ajouter `a.skip-link` en début de page + style visuel au focus | P1 / S |
| Les avatars `alt` sont génériques ("photo 1") | Pas descriptifs | Remplacer par des descriptions ("Enfant qui saute sur un trampoline") ou retirer si décoratives (`alt=""`) | P1 / M |
| La couleur or/jaune (`#FFD54F`) utilisée au hover nav | Contraste faible sur fond sombre (≈ 1,9:1) | Utiliser uniquement en décor ; garder du blanc pour le texte | P1 / S |
| Animations AOS sur beaucoup d'éléments | Vertige possible | Ajouter `@media (prefers-reduced-motion: reduce)` pour désactiver | P1 / S |
| Les modales (PDF, popups) n'ont pas toujours le focus piégé | Navigation clavier peut sortir | Vérifier `aria-modal`, piéger le focus (utiliser MUI Dialog qui le fait) | P1 / M |
| Émojis 🎉🍔 décoratifs sans aria-hidden | Lecture brouillon | Les masquer aux lecteurs d'écran (sauf si porteurs de sens) | P2 / S |
| Les tableaux d'horaires MUI sont accessibles | ✅ | — | — |

### 2.9 SEO

| Constat | Problème | Action | Prio/Effort |
| --- | --- | --- | --- |
| `next-sitemap.config.js` utilise `example.com` si `SITE_URL` non définie | Le sitemap généré pointe vers example.com (visible dans le build) | 1) Configurer `SITE_URL=https://noliparc.fr` dans l'environnement ; 2) retirer `sitemap.ts` (doublon) ou garder une seule source | **P0 / S** |
| `metadata` du layout : title template `%s | Noliparc` ✅ | Anniversaires/Nolijump/Snack ont leurs meta via layouts ✅ | Compléter OG images par page ; ajouter `robots` (déjà ok) | P1 / S |
| Pas de FAQ/schéma structuré (hors LocalBusiness) | Petites chances d'apparaître en rich results | Ajouter un JSON-LD `FAQPage` (5 questions : prix, âge, chaussettes, privatisation, où ?) et `OfferCatalog` pour les tarifs | P1 / M |
| Les titres de section sont des `h2` ✅ | — | Vérifier qu'il n'y a qu'un seul `h1` par page (home, nolijump ✅, galeries `h1` ✅) | P1 / S |
| La page `/preview` est indexée mais sans enjeu | Dupliquer l'usage galerie | La garder mais `noindex` (elle sert juste de galerie) ou la fusionner avec la home | P2 / S |
| Pas de page "Horaires" dédiée (le calendrier est figé en décembre) | Faible visibilité long-tail | Créer une vraie page `/horaires` (ou activer la navigation mois) + sitemap | P1 / M |
| Alt et images optimisées via `next/image` | ✅ | — | — |

### 2.10 Performance

| Constat | Problème | Action | Prio/Effort |
| --- | --- | --- | --- |
| Vidéos hero externes (archive.org) | LCP lourd, dépendance externe | Poster image + lecture au clic/desktop + `preload="metadata"` | **P0 / L** |
| Galerie Nolijump : 27 images dans un swiper + thumbnails | Beaucoup de requêtes | Grille de 6-8 + page galerie ; `sizes` corrects (déjà ajoutés pour features) | P0 / M |
| Images événements (home) en `<img>` natif | Pas d'optimisation | Migrer vers `next/image` en ajoutant le domaine dans `next.config.js` (`.ufs.sh` déjà whitelisté) | P1 / S |
| `aos` chargé sur chaque page (`aos.init`) | JS inutile si peu d'éléments animés | Garder sur home/nolijump, retirer sur les pages simples ; ou utiliser CSS-only | P2 / M |
| React 19 + MUI 7 ✅ | — | Vérifier le budget JS sur mobile (Lighthouse) : cible < 300 Ko JS initial | P1 / L |
| Lazy-loading monstrueux | — | Ajouter `loading="lazy"` sur le `<img>` de la popup Leaflet et les images de footer | P1 / S |

### 2.11 Contenu & copywriting

| Constat | Problème | Action | Prio/Effort |
| --- | --- | --- | --- |
| Mélange "tu"/"vous" | Incohérent ("Viens", "Inscrivez-vous") | Uniformiser en **"tu"** (marque jeune/famille) ou "vous" selon cible — décider et appliquer | P1 / M |
| Apostrophes typographiques en `&apos;` (plate) | Peu élégant | Remplacer par ’ ("l'événement" → "l’événement") dans les textes clés | P2 / M |
| Phrases longues dans les features | Non scannées | Réécriture courte + puces ; hiérarchie "titre → 1 phrase → 3 puces → CTA" | P1 / M |
| CTA hétérogènes : "Envoyer ma demande", "Réserver", "Voir les formules" | Ambigu | Définir un vocabulaire d'action : **"Réserver ma date"** partout | P1 / S |

### 2.12 Admin

| Constat | Problème | Action | Prio/Effort |
| --- | --- | --- | --- |
| Tableaux sans pagination ni tri | Listes longues (réservations, users) | Ajouter pagination + tri par date/statut | P2 / M |
| Statuts (pending/confirmed/canceled) via `alert()` natif | UX brute | Remplacer par des confirmations MUI + toasts | P2 / M |
| Dashboard : graphiques ✅ | — | Ajouter des **filtres de période** (7/30/90 jours) et export CSV | P2 / M |
| Aucune recherche avancée | — | Filtres combinables (statut × date × formule) | P3 / L |

---

## 3. Feuille de route (phases)

### ✅ Phase 0 — T1 : Quick wins (≈ 1-2 jours)
1. Configurer `SITE_URL` (sitemap correct) et supprimer le doublon `sitemap.ts`.
2. Page 404 + skip-link.
3. Bouton **"Réserver"** dans la navbar + liens Snack/Quad/Calendrier.
4. Snack : libellés "Bonbon" clarifiés.
5. Avertissement "acompte 50 %" remonté en haut de la page anniversaires.
6. `prefers-reduced-motion` pour AOS.

### 🏗️ Phase 1 — Structure & cohérence (semaine 1)
1. Réordonner la page d'accueil (infos clés → activités → tarifs → horaires → galerie → règles).
2. Uniformiser les sections "Tarifs" (cartes) sur la home.
3. Titre de page harmonisé : 1 hero par type (page standard / page festif) — pas de dérive.
4. Réécriture concise des features (home + nolijump) + vocabulaire CTA unique.
5. Règlement : 5 règles + lien PDF.

### 💰 Phase 2 — Conversion réservation (semaine 2)
1. Tutoriel : fusion étapes "Infos enfant" + "Participants".
2. Estimateur de prix temps réel + minimum d'enfants bloquant.
3. Option chaussettes 5€/8,99€ dans le tunnel.
4. Récapitulatif sticky mobile + page de confirmation dédiée.
5. Galerie Nolijump en grille 6-8 + page "toutes les photos".

### 🚀 Phase 3 — Perf / SEO / Access (semaine 3+)
1. Hero home : poster image + vidéo au clic.
2. Budget JS mobile (Lighthouse) + migration `<img>` → `next/image`.
3. FAQ JSON-LD + page horaires réelle + OG images.
4. Audit contrastes (or/jaune) et focus modal.
5. Admin : pagination, filtres, confirmations MUI, export CSV.

---

## 4. Comment mesurer le succès ?

| Métrique | Outil | Cible |
| --- | --- | --- |
| LCP mobile | Vercel Analytics + Lighthouse | < 2,5 s |
| Taux de rebond | Analytics | -10 % vs aujourd'hui |
| Tunnel réservation : étapes vues → envoi | `/api/tracking` existant (click/open) → poser des événements sur CTA & étapes du stepper | > 30 % d'achèvement |
| Inscriptions | Analytics | +20 % |
| Clics "Réserver" navbar | `/api/tracking/click` | → suivre mensuellement |
| Occurrences du mot "sitemap example.com" | `curl /robots.txt`, `curl /sitemap.xml` | 0 |

> Suggestion : installer un petit **heatmap session_ replay** (Microsoft Clarity, gratuit) pour valider l'agencement réel des parcours avant/après.

---

## 5. Checklist "agencement idéal" par page (à garder sous les yeux)

| Page | Hero | Bandeau clé | Contenu principal | Fin de page |
| --- | --- | --- | --- | --- |
| Accueil | 1 visuel + 1 message + 1 CTA | Ouverture/Adresse | Activités → Tarifs → Horaires → Événements → Règles | Carte + Contact + Footer |
| Nolijump | Logo + titre + CTA | 4 infos | Activités → Galerie (6-8) → Horaires → Tarifs | Footer |
| Anniversaires | Hero festif + badges | Acompte & chaussettes | Formules (grilles + Golden) | Footer |
| Snack | Header + intro | — | Menus groupés | Footer |
| Quad / Preview | Header | — | Galerie | Footer |
| Calendrier | Header | — | Calendrier navigable + légende | Footer |
| Auth | Logo + titre | Note sécurité | Formulaire court | Footer légal |

---

*Document évolutif — mettre à jour après chaque phase validée. Les petits chantiers (< 2h) sont identifiables pour être traités au fil de l'eau.*