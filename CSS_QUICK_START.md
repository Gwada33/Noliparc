# Quick Start - Système CSS Noliparc

## Démarrer rapidement

### 1. Créer un nouveau composant avec styles

```bash
# Créez votre dossier de composant
mkdir -p src/components/MyComponent

# Créez les fichiers
touch src/components/MyComponent/MyComponent.tsx
touch src/components/MyComponent/MyComponent.module.css
touch src/components/MyComponent/index.ts
```

### 2. Exemple complet

**MyComponent.tsx**
```jsx
import styles from './MyComponent.module.css';

export function MyComponent({ title, onClick }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <button className={styles.button} onClick={onClick}>
        Cliquez-moi
      </button>
    </div>
  );
}
```

**MyComponent.module.css**
```css
.container {
  padding: var(--spacing-lg);
  background: var(--color-neutral-light);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition-base);
}

.container:hover {
  box-shadow: var(--shadow-lg);
}

.title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.button {
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: var(--font-weight-semibold);
  transition: background-color var(--transition-base);
}

.button:hover {
  background-color: var(--color-primary-dark);
}

.button:active {
  transform: scale(0.98);
}
```

**index.ts**
```ts
export { MyComponent } from './MyComponent';
```

### 3. Importer et utiliser

```jsx
import { MyComponent } from '@/components/MyComponent';

export function HomePage() {
  return (
    <MyComponent 
      title="Bienvenue!" 
      onClick={() => alert('Cliqué!')}
    />
  );
}
```

## Variables CSS Disponibles

### Couleurs (copier-coller rapide)

```css
var(--color-primary)              /* #FF6B35 - Orange principal */
var(--color-secondary)            /* #4ECDC4 - Turquoise */
var(--color-accent-pink)          /* Rose */
var(--color-accent-purple)        /* Violet */
var(--color-accent-yellow)        /* Jaune */
var(--color-accent-green)         /* Vert */
var(--color-neutral-dark)         /* Noir profond */
var(--color-neutral-light)        /* Blanc cassé */
var(--color-neutral-text)         /* Texte */
```

### Espacement

```css
var(--spacing-xs)   /* 4px */
var(--spacing-sm)   /* 8px */
var(--spacing-md)   /* 16px */
var(--spacing-lg)   /* 24px */
var(--spacing-xl)   /* 32px */
var(--spacing-2xl)  /* 48px */
var(--spacing-3xl)  /* 64px */
var(--spacing-4xl)  /* 96px */
```

### Typographie

```css
var(--font-size-xs)    /* 12px */
var(--font-size-sm)    /* 14px */
var(--font-size-base)  /* 16px */
var(--font-size-lg)    /* 18px */
var(--font-size-xl)    /* 20px */
var(--font-size-2xl)   /* 24px */
var(--font-size-3xl)   /* 30px */
var(--font-size-4xl)   /* 36px */
var(--font-size-5xl)   /* 48px */
```

### Autres tokens

```css
var(--border-radius-sm)   /* 4px */
var(--border-radius-md)   /* 8px */
var(--border-radius-lg)   /* 12px */
var(--border-radius-full) /* Rond complet */

var(--shadow-sm)  /* Ombre légère */
var(--shadow-md)  /* Ombre moyenne */
var(--shadow-lg)  /* Ombre forte */
var(--shadow-xl)  /* Ombre très forte */

var(--transition-fast)    /* 150ms */
var(--transition-base)    /* 200ms */
var(--transition-slow)    /* 300ms */
```

## Animations Prêtes à l'Emploi

```css
.animated {
  animation: bounce var(--transition-base);  /* Rebond */
  animation: float var(--transition-slow);   /* Lévitation */
  animation: pulse var(--transition-base);   /* Pulsation */
  animation: slideIn var(--transition-base); /* Glissement */
  animation: fadeIn var(--transition-base);  /* Apparition */
  animation: rotateIn var(--transition-base);/* Rotation */
}
```

## Composants Existants à Réutiliser

- **Navbar** - Navigation principale
- **Footer** - Pied de page
- **HeroCarousel** - Carrousel hero
- **Formule** - Cartes de tarifs
- **Boutons** - Voir `src/styles/components/_buttons.css`

## Checklist pour un nouveau composant

- [ ] Créer le dossier du composant
- [ ] Créer le `.tsx`
- [ ] Créer le `.module.css`
- [ ] Créer l'`index.ts`
- [ ] Utiliser les tokens CSS (jamais de couleurs en dur!)
- [ ] Tester sur mobile (breakpoints)
- [ ] Utiliser `var(--color-*)` pour les couleurs
- [ ] Importer via l'index pour une meilleure maintenabilité

## Troubleshooting Rapide

**Les styles ne s'appliquent pas?**
```jsx
// ❌ Mauvais
<div className="container">...</div>

// ✅ Correct
<div className={styles.container}>...</div>
```

**Les couleurs semblent différentes?**
```css
/* ❌ Mauvais */
color: #FF6B35;

/* ✅ Correct */
color: var(--color-primary);
```

**L'espacement ne semble pas aligné?**
```css
/* ❌ Mauvais */
margin: 15px;

/* ✅ Correct */
margin: var(--spacing-md);  /* 16px */
```

---

**Besoin d'aide?** Consultez `DESIGN_SYSTEM.md` pour la documentation complète.  
**Vous avez un bug CSS?** Vérifiez d'abord que vous utilisez les tokens! 🎯
