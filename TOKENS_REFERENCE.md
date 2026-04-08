# Design Tokens Reference - Noliparc CSS System

*Référence rapide de tous les design tokens disponibles*

---

## 🎨 Couleurs - Colors

### Couleurs Primaires
```css
--color-primary: #FF6B35;           /* Orange principal - Utiliser pour les CTA */
--color-primary-dark: #E55A24;      /* Orange sombre - Hover states */
--color-primary-light: #FFB366;     /* Orange clair - Backgrounds */
```

### Couleurs Secondaires
```css
--color-secondary: #4ECDC4;         /* Turquoise - Complémentaire */
--color-secondary-dark: #36A39B;    /* Turquoise sombre - Interactions */
--color-secondary-light: #7EE0DB;   /* Turquoise clair - Light backgrounds */
```

### Couleurs d'Accent
```css
--color-accent-pink: #FF6B9D;       /* Rose ludique */
--color-accent-purple: #B563D8;     /* Violet moderne */
--color-accent-yellow: #FFD93D;     /* Jaune énergique */
--color-accent-green: #6BCB77;      /* Vert naturel */
```

### Couleurs Neutres
```css
--color-neutral-dark: #0F0F10;      /* Noir profond - Texte principal */
--color-neutral-light: #F5F5F5;     /* Blanc cassé - Backgrounds */
--color-neutral-border: #E8E8E8;    /* Gris léger - Bordures */
--color-neutral-text: #333333;      /* Gris foncé - Texte secondaire */
```

### Exemple d'Usage
```css
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-neutral-light);
}

.button-primary:hover {
  background-color: var(--color-primary-dark);
}

.card {
  background-color: var(--color-neutral-light);
  border: 1px solid var(--color-neutral-border);
}
```

---

## 📝 Typographie - Typography

### Tailles de Police
```css
--font-size-xs:    0.75rem;    /* 12px */
--font-size-sm:    0.875rem;   /* 14px */
--font-size-base:  1rem;       /* 16px */
--font-size-lg:    1.125rem;   /* 18px */
--font-size-xl:    1.25rem;    /* 20px */
--font-size-2xl:   1.5rem;     /* 24px */
--font-size-3xl:   1.875rem;   /* 30px */
--font-size-4xl:   2.25rem;    /* 36px */
--font-size-5xl:   3rem;       /* 48px */
```

### Poids de Police
```css
--font-weight-light:      300;
--font-weight-normal:     400;
--font-weight-medium:     500;
--font-weight-semibold:   600;
--font-weight-bold:       700;
```

### Familles de Police
```css
--font-family-sans: 'Rubik', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-family-mono: 'Courier New', monospace;
```

### Exemple d'Usage
```css
h1 {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.body-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  color: var(--color-neutral-text);
}

.label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}
```

---

## 📏 Espacement - Spacing

*Base: 4px (0.25rem)*

```css
--spacing-xs:   0.25rem;    /* 4px - Espaces très serrés */
--spacing-sm:   0.5rem;     /* 8px - Espaces serrés */
--spacing-md:   1rem;       /* 16px - Espacement standard */
--spacing-lg:   1.5rem;     /* 24px - Espacement large */
--spacing-xl:   2rem;       /* 32px - Espacement très large */
--spacing-2xl:  3rem;       /* 48px - Section spacing */
--spacing-3xl:  4rem;       /* 64px - Large section spacing */
--spacing-4xl:  6rem;       /* 96px - Hero spacing */
```

### Exemple d'Usage
```css
.card {
  padding: var(--spacing-lg);        /* 24px all sides */
  margin-bottom: var(--spacing-xl);  /* 32px bottom */
}

.section {
  padding: var(--spacing-3xl) var(--spacing-2xl);  /* 64px top/bottom, 48px sides */
}

.input {
  padding: var(--spacing-md) var(--spacing-lg);    /* 16px top/bottom, 24px sides */
}
```

---

## ✨ Effets Visuels - Effects

### Ombres
```css
--shadow-sm:  0 1px 2px rgba(0, 0, 0, 0.05);      /* Très légère */
--shadow-md:  0 4px 10px rgba(0, 0, 0, 0.08);     /* Légère */
--shadow-lg:  0 8px 20px rgba(0, 0, 0, 0.12);     /* Moyenne */
--shadow-xl:  0 12px 30px rgba(0, 0, 0, 0.15);    /* Forte */
```

### Rayons de Bordure
```css
--border-radius-sm:   4px;
--border-radius-md:   8px;
--border-radius-lg:   12px;
--border-radius-full: 9999px;  /* Complètement rond */
```

### Transitions
```css
--transition-fast:  150ms ease-out;
--transition-base:  200ms ease-out;
--transition-slow:  300ms ease-out;
```

### Exemple d'Usage
```css
.card {
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition-base),
              transform var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.button {
  border-radius: var(--border-radius-md);
  transition: background-color var(--transition-fast);
}
```

---

## 🎬 Animations - Animations

*Toutes les animations sont prêtes à l'emploi!*

### Animations Disponibles
```css
animation: bounce;      /* Rebond ludique */
animation: float;       /* Lévitation douce */
animation: pulse;       /* Pulsation d'intensité */
animation: slideIn;     /* Glissement d'entrée */
animation: slideInUp;   /* Glissement vertical */
animation: fadeIn;      /* Apparition progressive */
animation: rotateIn;    /* Rotation d'entrée */
animation: bounce-y;    /* Rebond vertical */
animation: gradientShift; /* Changement dégradé */
```

### Utilisation des Animations
```css
.animated-element {
  animation: bounce var(--transition-base);
}

.hover-animation:hover {
  animation: float var(--transition-slow);
}

.fade-in-on-load {
  animation: fadeIn var(--transition-slow) ease-in-out;
}

.pulsing-button {
  animation: pulse 2s ease-in-out infinite;
}
```

### Exemple Complet
```css
.hero-section {
  animation: slideInUp var(--transition-slow) ease-out;
}

.cta-button {
  animation: bounce var(--transition-base) ease-out;
  cursor: pointer;
  transition: transform var(--transition-base);
}

.cta-button:hover {
  animation: pulse 0.5s ease-in-out;
  transform: scale(1.05);
}
```

---

## 🏗️ Breakpoints Responsive

*Mobile First Approach*

```css
/* Mobile: < 640px (default) */

/* Tablet: >= 640px */
@media (min-width: 640px) {
  .responsive-text {
    font-size: var(--font-size-lg);
  }
}

/* Desktop: >= 768px */
@media (min-width: 768px) {
  .responsive-text {
    font-size: var(--font-size-xl);
  }
}

/* Large Desktop: >= 1024px */
@media (min-width: 1024px) {
  .responsive-text {
    font-size: var(--font-size-2xl);
  }
}

/* XL Desktop: >= 1280px */
@media (min-width: 1280px) {
  .responsive-text {
    font-size: var(--font-size-3xl);
  }
}
```

---

## 🧩 Combinaisons Recommandées

### Pour un Bouton Principal
```css
.button-primary {
  background-color: var(--color-primary);
  color: var(--color-neutral-light);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  cursor: pointer;
}

.button-primary:hover {
  background-color: var(--color-primary-dark);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Pour une Carte / Card
```css
.card {
  background-color: var(--color-neutral-light);
  border: 1px solid var(--color-neutral-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.card-title {
  color: var(--color-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
}

.card-description {
  color: var(--color-neutral-text);
  font-size: var(--font-size-base);
  line-height: 1.6;
}
```

### Pour une Section Héro
```css
.hero-section {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  padding: var(--spacing-4xl) var(--spacing-3xl);
  border-radius: var(--border-radius-lg);
  color: var(--color-neutral-light);
  text-align: center;
  animation: slideInUp var(--transition-slow);
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-lg);
}

.hero-subtitle {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-medium);
  opacity: 0.95;
}
```

---

## 📋 Checklist de Création de Composant

Avant de coder votre CSS, assurez-vous:

- [ ] Utiliser `--color-*` pour **toutes** les couleurs
- [ ] Utiliser `--spacing-*` pour **tous** les marges/padding
- [ ] Utiliser `--font-size-*` pour **toutes** les tailles de texte
- [ ] Utiliser `--font-weight-*` pour **tous** les poids de police
- [ ] Utiliser `--border-radius-*` pour **tous** les coins arrondis
- [ ] Utiliser `--shadow-*` pour **toutes** les ombres
- [ ] Utiliser `--transition-*` pour **toutes** les transitions
- [ ] Tester les breakpoints responsive (640px, 768px, 1024px)
- [ ] Vérifier le contraste des couleurs (WCAG AA minimum)
- [ ] Pas de `!important` (sauf cas exceptionnel!)

---

## 🎯 Copier-Coller Rapide

**Couleur primaire**:
```css
color: var(--color-primary);
```

**Espacement standard**:
```css
padding: var(--spacing-lg);
margin: var(--spacing-md);
```

**Texte normal**:
```css
font-size: var(--font-size-base);
font-weight: var(--font-weight-normal);
```

**Titre**:
```css
font-size: var(--font-size-2xl);
font-weight: var(--font-weight-bold);
color: var(--color-primary);
```

**Ombre légère**:
```css
box-shadow: var(--shadow-md);
```

**Arrondi standard**:
```css
border-radius: var(--border-radius-md);
```

**Animation ludique**:
```css
animation: bounce var(--transition-base);
```

---

## 🔗 Liens Utiles

- **Design System Complet**: `DESIGN_SYSTEM.md`
- **Quick Start Guide**: `CSS_QUICK_START.md`
- **Changelog**: `CHANGELOG_CSS_REFACTOR.md`
- **Tokens Source**: `src/styles/tokens/`

---

**Dernière mise à jour**: Avril 2026  
**Version**: 1.0  
**Status**: ✅ Production Ready
