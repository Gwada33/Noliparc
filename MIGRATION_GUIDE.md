# Guide de Migration - Ancien CSS → Nouveau Système

*Ce guide s'adresse aux développeurs ayant du code CSS à migrer du système ancien*

## 🎯 Objectif

Convertir les anciens fichiers CSS globaux en CSS Modules structurés utilisant les design tokens.

---

## 📋 Avant de Commencer

### ✅ Checklist Prérequis

- [ ] Vous avez accès à `src/styles/` (nouveau système)
- [ ] Vous comprenez les CSS Modules (scoped CSS)
- [ ] Vous connaissez les design tokens (variables CSS)
- [ ] Vous avez lu `DESIGN_SYSTEM.md`
- [ ] Vous avez accès à `TOKENS_REFERENCE.md`

---

## 🔄 Processus de Migration - 5 Étapes

### Étape 1: Identifier le Code CSS à Migrer

**Trouvez le fichier CSS ancien** (ex: `src/css/mon-composant.css`)

**Ou trouvez l'import CSS** dans un composant:
```jsx
// Ancien système (À SUPPRIMER)
import "@/css/mon-composant.css";
```

### Étape 2: Créer la Structure du CSS Module

Créez les fichiers pour votre composant:

```bash
# Structure pour un composant
mkdir -p src/components/MonComposant
touch src/components/MonComposant/MonComposant.tsx
touch src/components/MonComposant/MonComposant.module.css
touch src/components/MonComposant/index.ts
```

### Étape 3: Convertir le CSS

**Ancien CSS:**
```css
/* src/css/mon-composant.css */
.container {
  background-color: #FF6B35;
  padding: 24px;
  margin-bottom: 32px;
  border-radius: 8px;
  color: #0F0F10;
  font-size: 20px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.container:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.title {
  color: #FF6B35;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.description {
  color: #333333;
  font-size: 16px;
  line-height: 1.6;
}
```

**Nouveau CSS Module:**
```css
/* src/components/MonComposant/MonComposant.module.css */
.container {
  background-color: var(--color-primary);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  border-radius: var(--border-radius-md);
  color: var(--color-neutral-dark);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  box-shadow: var(--shadow-md);
  transition: box-shadow var(--transition-base);
}

.container:hover {
  box-shadow: var(--shadow-lg);
}

.title {
  color: var(--color-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-md);
}

.description {
  color: var(--color-neutral-text);
  font-size: var(--font-size-base);
  line-height: 1.6;
}
```

### Étape 4: Mettre à Jour le Composant React

**Ancien composant:**
```jsx
import "@/css/mon-composant.css";

export default function MonComposant() {
  return (
    <div className="container">
      <h2 className="title">Titre</h2>
      <p className="description">Description</p>
    </div>
  );
}
```

**Nouveau composant:**
```jsx
import styles from './MonComposant.module.css';

export function MonComposant() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Titre</h2>
      <p className={styles.description}>Description</p>
    </div>
  );
}
```

**Créer index.ts:**
```ts
export { MonComposant } from './MonComposant';
```

### Étape 5: Mettre à Jour les Imports

**Dans les fichiers qui utilisent ce composant:**

```diff
// Avant
- import MonComposant from "@/components/MonComposant";
- import "@/css/mon-composant.css";

// Après
+ import { MonComposant } from "@/components/MonComposant";
```

---

## 🎨 Table de Conversion - Couleurs

Utilisez cette table pour convertir les anciennes couleurs:

| Couleur Ancienne | Équivalent Nouveau | Token |
|---|---|---|
| #FF6B35 | Orange primaire | `var(--color-primary)` |
| #E55A24 | Orange sombre | `var(--color-primary-dark)` |
| #FFB366 | Orange clair | `var(--color-primary-light)` |
| #DB7C26 | Orange ancien (remplacé) | `var(--color-primary)` |
| #4ECDC4 | Turquoise | `var(--color-secondary)` |
| #0F0F10 | Noir profond | `var(--color-neutral-dark)` |
| #F5F5F5 | Blanc cassé | `var(--color-neutral-light)` |
| #333333 | Gris texte | `var(--color-neutral-text)` |
| #E8E8E8 | Gris bordure | `var(--color-neutral-border)` |

---

## 📏 Table de Conversion - Espacement

| Valeur Ancienne | Équivalent Nouveau | Token |
|---|---|---|
| 4px | 4px | `var(--spacing-xs)` |
| 8px | 8px | `var(--spacing-sm)` |
| 12px | 16px | `var(--spacing-md)` |
| 16px | 16px | `var(--spacing-md)` |
| 20px | 24px | `var(--spacing-lg)` |
| 24px | 24px | `var(--spacing-lg)` |
| 32px | 32px | `var(--spacing-xl)` |
| 48px | 48px | `var(--spacing-2xl)` |

*Note: Les valeurs ne correspondent pas exactement - préférez l'échelle standardisée!*

---

## 🔤 Table de Conversion - Typographie

| Propriété | Ancienne Méthode | Nouvelle Méthode |
|---|---|---|
| Taille | `font-size: 16px;` | `font-size: var(--font-size-base);` |
| Poids Gras | `font-weight: 700;` | `font-weight: var(--font-weight-bold);` |
| Poids Normal | `font-weight: 400;` | `font-weight: var(--font-weight-normal);` |
| Poids Semi-gras | `font-weight: 600;` | `font-weight: var(--font-weight-semibold);` |

---

## ✨ Exemples de Migration Complète

### Exemple 1: Composant Simple

**AVANT:**
```jsx
// components/Card.jsx
import "@/css/card.css";

export default function Card({ title, children }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div className="card-content">{children}</div>
    </div>
  );
}
```

```css
/* css/card.css */
.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #E8E8E8;
}

.card-title {
  color: #FF6B35;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.card-content {
  color: #333333;
  font-size: 14px;
  line-height: 1.6;
}
```

**APRÈS:**
```jsx
// components/Card/Card.tsx
import styles from './Card.module.css';

export function Card({ title, children }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
}
```

```css
/* components/Card/Card.module.css */
.card {
  background: var(--color-neutral-light);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-neutral-border);
  transition: box-shadow var(--transition-base);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.cardTitle {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-md) 0;
}

.cardContent {
  color: var(--color-neutral-text);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}
```

```ts
// components/Card/index.ts
export { Card } from './Card';
```

### Exemple 2: Composant avec Animations

**AVANT:**
```css
/* css/button-animated.css */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.button {
  background: #FF6B35;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-out;
}

.button:hover {
  background: #E55A24;
  animation: bounce 0.5s ease-out;
}
```

**APRÈS:**
```css
/* components/AnimatedButton/AnimatedButton.module.css */
.button {
  background: var(--color-primary);
  color: white;
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
}

.button:hover {
  background: var(--color-primary-dark);
  animation: bounce var(--transition-base);
}
```

*Note: L'animation `bounce` est définie dans `src/styles/tokens/_animations.css`*

---

## 🚨 Pièges Courants et Solutions

### Piège 1: Oublier `styles.`

**❌ ERREUR:**
```jsx
<div className="container">  {/* Classe ne sera pas trouvée! */}
```

**✅ CORRECT:**
```jsx
<div className={styles.container}>
```

### Piège 2: Valeurs en dur

**❌ ERREUR:**
```css
background-color: #FF6B35;  /* Color en dur */
```

**✅ CORRECT:**
```css
background-color: var(--color-primary);
```

### Piège 3: Pas d'index.ts

**❌ ERREUR:**
```jsx
import { Card } from "@/components/Card/Card";
```

**✅ CORRECT:**
```jsx
import { Card } from "@/components/Card";
```
*(Nécessite un `index.ts` dans le dossier)*

### Piège 4: Classe CSS avec tirets

**❌ ERREUR:**
```css
.card-title { ... }
```
```jsx
<h3 className={styles.card-title}>  {/* Erreur! */}
```

**✅ CORRECT:**
```css
.cardTitle { ... }  /* camelCase! */
```
```jsx
<h3 className={styles.cardTitle}>
```

---

## ✅ Checklist de Validation

Avant de terminer votre migration:

- [ ] Fichiers créés dans `src/components/MonComposant/`
- [ ] CSS Module créé avec `.module.css`
- [ ] Toutes les couleurs utilisant `var(--color-*)`
- [ ] Tous les espacements utilisant `var(--spacing-*)`
- [ ] Tous les styles utilisant `className={styles.className}`
- [ ] `index.ts` créé pour exporter le composant
- [ ] Ancien import CSS supprimé
- [ ] Nouveau import utilisant le chemin court
- [ ] Test en navigateur (desktop + mobile)
- [ ] Pas d'erreurs de console

---

## 🔍 Testing Votre Migration

### 1. Vérification Visuelle
```bash
npm run dev
# Visitez la page
# Comparez visuellement avec avant/après
```

### 2. Vérification Console
```bash
# Ouvrez DevTools (F12)
# Vérifiez qu'il n'y a pas d'erreurs CSS
# Vérifiez que les classes sont correctement appliquées
```

### 3. Vérification Mobile
```bash
# Testez sur un téléphone ou avec le mode mobile du navigateur
# Vérifiez les breakpoints responsive
```

---

## 📞 Vous Avez un Problème?

### Les styles ne s'appliquent pas?
1. Vérifiez que vous utilisez `className={styles.className}`
2. Vérifiez le nom de la classe dans le CSS Module
3. Vérifiez que le fichier `.module.css` est correct

### Les couleurs ne correspondent pas?
1. Vérifiez que vous utilisez `var(--color-*)`
2. Consultez `TOKENS_REFERENCE.md` pour voir les couleurs disponibles
3. Si la couleur n'existe pas, proposez-la!

### Les animations ne fonctionnent pas?
1. Vérifiez que l'animation existe dans `_animations.css`
2. Vérifiez la syntaxe: `animation: bounce var(--transition-base);`
3. Assurez-vous que `_animations.css` est importé dans `globals.css`

---

## 🎯 Prochaines Étapes

1. ✅ Migrer **tous** les composants
2. ✅ Supprimer le dossier `/css/` entièrement
3. ✅ Valider que tout fonctionne
4. ✅ Documenter les patterns spécifiques au projet

---

## 📚 Ressources

- `DESIGN_SYSTEM.md` - Documentation complète
- `TOKENS_REFERENCE.md` - Liste de tous les tokens
- `CSS_QUICK_START.md` - Guide rapide
- `src/styles/README.md` - Structure des styles

---

**Questions?** Consultez la documentation ou créez un ticket!  
**Bonne migration!** 🚀
