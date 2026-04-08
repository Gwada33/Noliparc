# Noliparc Design System - Système CSS Modernisé

## Overview

Le système CSS de Noliparc a été complètement refactorisé pour offrir une architecture **modulaire**, **maintenable** et **professionnelle** avec une identité visuelle dynamique et ludique inspirée par le design "new jump".

## Architecture du Système CSS

### Structure des Dossiers

```
src/
├── styles/
│   ├── globals.css              # Point d'entrée principal
│   ├── tokens/                  # Design tokens centralisés
│   │   ├── _colors.css         # Palette de couleurs
│   │   ├── _typography.css     # Système typographique
│   │   ├── _spacing.css        # Échelle d'espacement
│   │   ├── _effects.css        # Ombres et effets visuels
│   │   └── _animations.css     # Animations et keyframes
│   ├── base/                    # Styles de base
│   │   ├── _reset.css          # Normalisation CSS
│   │   └── _global.css         # Styles globaux
│   ├── utilities/               # Classes utilitaires
│   │   └── _utilities.css      # Utilitaires réutilisables
│   ├── components/              # Styles spécifiques aux composants
│   │   ├── _buttons.css        # Système de boutons
│   │   └── _snow.module.css    # Effet neige (module)
│   └── pages/                   # Styles des pages
│       ├── admin.module.css    # Styles de l'admin
│       ├── auth.module.css     # Styles de l'authentification
│       └── dashboard.module.css # Styles du dashboard
└── components/                  # Composants React avec CSS Modules
    ├── Navbar/
    │   ├── Navbar.tsx
    │   ├── Navbar.module.css
    │   └── index.ts
    ├── Footer/
    │   ├── Footer.tsx
    │   ├── Footer.module.css
    │   └── index.ts
    ├── Hero/
    │   ├── HeroCarousel.tsx
    │   ├── Hero.module.css
    │   └── index.ts
    └── Formule/
        ├── Formule.tsx
        ├── Formule.module.css
        └── index.ts
```

## Design Tokens

### Palette de Couleurs (Primary + Accent)

```css
/* Couleurs Primaires */
--color-primary: #FF6B35;           /* Orange énergique */
--color-primary-dark: #E55A24;      /* Orange sombre */
--color-primary-light: #FFB366;     /* Orange clair */

/* Couleurs Secondaires */
--color-secondary: #4ECDC4;         /* Turquoise dynamique */
--color-secondary-dark: #36A39B;    /* Turquoise sombre */
--color-secondary-light: #7EE0DB;   /* Turquoise clair */

/* Accents */
--color-accent-pink: #FF6B9D;       /* Rose ludique */
--color-accent-purple: #B563D8;     /* Violet moderne */
--color-accent-yellow: #FFD93D;     /* Jaune énergique */
--color-accent-green: #6BCB77;      /* Vert naturel */

/* Neutres */
--color-neutral-dark: #0F0F10;      /* Noir profond */
--color-neutral-light: #F5F5F5;     /* Gris très clair */
--color-neutral-border: #E8E8E8;    /* Bordures */
--color-neutral-text: #333333;      /* Texte principal */
```

### Typographie

```css
/* Police de base */
--font-family-sans: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-mono: 'Courier New', monospace;

/* Tailles */
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */
--font-size-4xl: 2.25rem;   /* 36px */
--font-size-5xl: 3rem;      /* 48px */

/* Poids */
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Espacement

```css
/* Échelle d'espacement (multiples de 4px) */
--spacing-xs: 0.25rem;      /* 4px */
--spacing-sm: 0.5rem;       /* 8px */
--spacing-md: 1rem;         /* 16px */
--spacing-lg: 1.5rem;       /* 24px */
--spacing-xl: 2rem;         /* 32px */
--spacing-2xl: 3rem;        /* 48px */
--spacing-3xl: 4rem;        /* 64px */
--spacing-4xl: 6rem;        /* 96px */
```

### Effets Visuels

```css
/* Ombres */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 10px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 20px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 12px 30px rgba(0, 0, 0, 0.15);

/* Rayons de bordure */
--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 12px;
--border-radius-full: 9999px;

/* Transitions */
--transition-fast: 150ms ease-out;
--transition-base: 200ms ease-out;
--transition-slow: 300ms ease-out;
```

### Animations

Les animations disponibles incluent:
- **bounce**: Effet de rebond ludique
- **float**: Lévitation douce
- **pulse**: Pulsation d'intensité
- **slideIn**: Glissement d'entrée
- **fadeIn**: Apparition progressive
- **bounce-y**: Rebond vertical
- **rotateIn**: Rotation d'entrée

## CSS Modules - Mode d'Emploi

### Pour les Composants

Créez un fichier CSS Module correspondant à votre composant:

```jsx
// Navbar.tsx
import styles from './Navbar.module.css';

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Contenu */}
      </div>
    </nav>
  );
}
```

```css
/* Navbar.module.css */
.navbar {
  background-color: var(--color-neutral-dark);
  padding: var(--spacing-md);
  animation: slideIn var(--transition-base);
}

.navContainer {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Utilisation des Tokens

Tous les tokens CSS sont accessibles via des variables CSS et peuvent être utilisés:

```css
.button {
  background-color: var(--color-primary);
  color: var(--color-neutral-light);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  transition: background-color var(--transition-base);
  box-shadow: var(--shadow-md);
}

.button:hover {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-lg);
}
```

## Système de Boutons

Trois variantes principales avec états:

```jsx
// Primaire
<button className={styles.buttonPrimary}>Action</button>

// Secondaire
<button className={styles.buttonSecondary}>Alternative</button>

// Tertiaire / Ghost
<button className={styles.buttonTertiary}>Plus discret</button>
```

États:
- **hover**: Amélioration de l'ombre et changement de couleur
- **active**: Enfoncé
- **disabled**: Désactivé
- **loading**: Avec spinner

## Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 640px) {  /* sm */
}

@media (min-width: 768px) {  /* md */
}

@media (min-width: 1024px) { /* lg */
}

@media (min-width: 1280px) { /* xl */
}
```

## Bonnes Pratiques

### ✅ À Faire

1. **Utiliser les tokens** plutôt que les valeurs en dur
2. **CSS Modules pour les composants** = isolation des styles garantie
3. **Flexbox d'abord** pour les layouts simples
4. **Animations subtiles** pour l'expérience utilisateur
5. **Noms de classes sémantiques** (ex: `.button-primary` au lieu de `.blue-btn`)
6. **Tester sur mobile** - approche "mobile-first"
7. **Réutiliser les classes utilitaires** du fichier `_utilities.css`

### ❌ À Éviter

1. ❌ Styles inline (excepté dans les cas spéciaux)
2. ❌ `!important` (indique un problème de spécificité)
3. ❌ Créer de nouvelles variables au lieu d'utiliser les tokens existants
4. ❌ Utiliser les anciens fichiers CSS du dossier `/css`
5. ❌ Copier-coller de code CSS sans les tokens
6. ❌ Oublier de mettre à jour le CSS Module si vous modifiez un composant

## Ajouter une Nouvelle Couleur

1. Ajoutez la variable dans `src/styles/tokens/_colors.css`
2. Utilisez-la via `var(--color-nom)`
3. Documentez le cas d'usage

```css
/* Dans _colors.css */
--color-success: #6BCB77;
--color-success-dark: #4A9D5F;
--color-success-light: #8FE89F;
```

## Ajouter une Nouvelle Animation

1. Ajoutez-la dans `src/styles/tokens/_animations.css`
2. Créez les keyframes associées
3. Utilisez-la dans un composant

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slideUp {
  animation: slideUp var(--transition-base);
}
```

## Dépannage

### Les styles ne s'appliquent pas
- Vérifiez que le CSS Module est correctement importé
- Assurez-vous d'utiliser `className={styles.className}`
- Vérifiez la spécificité CSS

### Les couleurs ne correspondent pas
- Vérifiez que vous utilisez `var(--color-*)` et non une valeur en dur
- Consultez `_colors.css` pour les variables disponibles

### Les animations ne fonctionnent pas
- Assurez-vous d'avoir importé `_animations.css` dans `globals.css`
- Vérifiez que l'élément a `animation` ou `animation-name` défini

## Migration depuis l'ancien système

Si vous trouvez un ancien fichier CSS importé:
1. Créez un CSS Module correspondant
2. Remplacez les couleurs en dur par des tokens
3. Supprimez l'importation de l'ancien fichier
4. Testez en navigateur

## Ressources

- **Fichier principal**: `src/styles/globals.css`
- **Tous les tokens**: `src/styles/tokens/`
- **Composants exemple**: `src/components/Navbar/`, `src/components/Footer/`
- **Documentation du plan**: `/v0_plans/realistic-approach.md`

---

**Dernière mise à jour**: Avril 2026  
**Version du système**: 1.0 - Production Ready  
**Équipe**: Noliparc Dev Team
