# Noliparc — Design System

> Document de référence du **front-end**. Il décrit (1) l'état actuel du style et (2) le design system cible qui a été mis en place.
> L'objectif : **garder les mêmes couleurs**, mais rendre l'interface **plus pro, plus enjouée, plus lisible** avec des **espacements cohérents**.

---

## 1. Audit de l'existant

### 1.1 Palette relevée (avant refonte)

Le projet utilisait de nombreuses variantes de couleurs en dur, parfois incohérentes :

| Rôle | Valeurs trouvées | Problème |
| --- | --- | --- |
| Orange primaire | `#DB7C26`, `#ff6600`, `#e2511d`, `#FF8811`, `#e65100`, `#ef6c00`, `#c96f22`, `#f97316` | 8 oranges différents pour la même action |
| Bleu secondaire | `#03a9f4`, `#1565c0`, `#08AEEA`, `#0066cc`, `#007bff` | plusieurs bleus sans hiérarchie |
| Vert | `#2e7d32`, `#1b5e20`, `#45a049`, `#4CAF50`, `#78c343`, `#71B340`, `#A8D672`, `#3FBF3F` | mélange vert « statut » et vert « ludique » |
| Rose / fun | `#e91e63`, `#c2185b`, `#ff6f4f` | utilisé pour réservation / anniversaires |
| Doré (hover) | `#ffd700`, `#F7CE68` | |
| Neutres | `#1f1f1f`, `#171717`, `#333`, `#555`, `#666`, `#aaa`, `#f8f9fa`, `#f5f5f5`, `#fff7f0`, `#fff8f2`, `#f3d0a3` | gris hétérogènes |

### 1.2 Points d'amélioration

- **Espacements arbitraires** : `margin-top: 10rem`, `gap: 10vh`, `padding: 5rem`, `margin-bottom: -8rem`… sans échelle commune.
- **Boutons dupliqués** : `.btn-primary` défini dans `globals.css` **et** `nolijump.css` ; `.btn-secondary` dans `globals.css` **et** `features.css`.
- **Fichiers qui se marchent dessus** : `:root` redéfini dans `admin-dashboard.css`, styles « main/h1/button » globaux dans `admin.css`.
- **Footer** : marges négatives et `transform: translateY(-8rem)` fragiles.
- **Typographie** : Rubik chargée **deux fois** (via `next/font` dans `layout.tsx` **et** `@import` Google Fonts dans `globals.css`).

---

## 2. Design system cible

### 2.1 Couleurs (tokens `src/css/tokens.css`)

Consolidation de l'existant en une palette unique. **Les couleurs de marque sont inchangées.**

| Token | Valeur | Usage |
| --- | --- | --- |
| `--color-primary` | `#DB7C26` | Action principale (CTA), liens actifs, accents |
| `--color-primary-hover` | `#c96f22` | Hover des CTA |
| `--color-primary-dark` | `#B05A12` | Texte sur fond clair (contraste WCAG) |
| `--color-primary-soft` | `#FDF1E5` | Pastille / fond d'accent |
| `--color-secondary` | `#03a9f4` | Actions secondaires (liens « en savoir plus ») |
| `--color-secondary-soft` | `#E1F5FE` | Fond d'accent bleu |
| `--color-accent` | `#e91e63` | « Fun » / anniversaires / réservation |
| `--color-accent-soft` | `#FCE4EC` | Fond rose |
| `--color-success` | `#2e7d32` | Statut « ouvert », succès |
| `--color-success-soft` | `#E8F5E9` | Fond vert |
| `--color-lime` | `#A8D672` | Touche ludique (bannière infos) |
| `--color-gold` | `#FFD54F` | Hover navigation / étoiles |
| `--color-warning` | `#ef6c00` | Avertissement |
| `--color-danger` | `#d32f2f` | Fermé / erreur |
| `--color-info` | `#1565c0` | Information |

**Neutres**

| Token | Valeur | Usage |
| --- | --- | --- |
| `--color-ink` | `#171717` | Texte principal |
| `--color-slate` | `#555555` | Texte secondaire |
| `--color-muted` | `#8a8f98` | Texte discret / légende |
| `--color-line` | `#e5e7eb` | Bordures |
| `--color-surface` | `#ffffff` | Fonds de carte |
| `--color-surface-alt` | `#f8f9fa` | Fond de section |
| `--color-dark` | `#1f1f1f` | Navbar / footer |
| `--color-dark-soft` | `#2a2a2a` | Surfaces sombres secondaires |

### 2.2 Typographie

- **Police** : `Rubik` (déjà chargée via `next/font` — l'`@import` Google Fonts redondant a été supprimé).
- **Graisses** : `400` (corps), `500` (navigation), `600` (sous-titres), `700` (titres), `800` (chiffres/prix).
- **Échelle** (via `clamp()` pour rester responsive) :
  - Titre page : `clamp(2rem, 5vw, 3.5rem)`
  - Titre section : `clamp(1.5rem, 3.5vw, 2.5rem)`
  - Corps : `1rem` / `1.125rem`
  - Petit : `0.875rem`

### 2.3 Espacements (échelle en base 4px)

`--space-0` → `--space-24` : `0`, `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, `48px`, `64px`, `80px`, `96px`.

**Règles appliquées :**

- Sections : `--space-20` (80px) / `--space-24` (96px) de marge verticale.
- Cartes : padding `--space-6` (24px), gap `--space-4` (16px).
- Le `margin-top: 10rem` du `.feature-container` est remplacé par une valeur de l'échelle.

### 2.4 Rayons & ombres

- **Rayons** : `--radius-sm` (8px), `--radius-md` (12px), `--radius-lg` (16px), `--radius-xl` (24px), `--radius-full` (9999px).
- **Ombres** :
  - `--shadow-sm` : `0 1px 2px rgba(0,0,0,0.05)`
  - `--shadow-md` : `0 4px 12px rgba(0,0,0,0.08)`
  - `--shadow-lg` : `0 12px 30px rgba(0,0,0,0.12)`
  - `--shadow-xl` : `0 20px 50px rgba(0,0,0,0.16)`

### 2.5 Motion & z-index

- `--transition` : `0.2s ease`
- `--transition-slow` : `0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Z-index : `--z-navbar: 1000`, `--z-overlay: 2000`, `--z-modal: 3000`, `--z-toast: 4000`.

---

## 3. Composants

| Composant | Fichier | Ce qui change |
| --- | --- | --- |
| Navbar | `src/css/navbar.css` | hauteur, ombre au scroll, états clairs, espacements cohérents |
| Hero | `src/css/hero.css` | dégradé d'overlay pour lisibilité, titres responsives |
| Footer | `src/css/footer.css` | suppression des marges négatives, grille propre |
| Features | `src/css/features.css` | espacements, cartes alignées, boutons unifiés |
| Formules | `src/css/formule.css` | cartes avec token, prix alignés |
| Snack | `src/css/snack.css` | grille responsive, ombres douces |
| Calendrier / Avent | `src/css/calendar.css`, `advent.css` | couleurs de statut via tokens |
| Admin | `src/css/admin-dashboard.css`, `admin.css` | tokens partagés, focus visible |

---

## 4. Fichiers

| Fichier | Rôle |
| --- | --- |
| `src/css/tokens.css` | Tous les design tokens (couleurs, espacements, rayons, ombres, typos, z-index) |
| `src/css/globals.css` | Reset, base, composants partagés (boutons, conteneurs) |
| `src/css/*.css` | Styles par zone, qui **consomment** les tokens |

La règle : **on n'écrit plus de couleur en dur** dans les composants — on référence un token.
