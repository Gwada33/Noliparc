# Système CSS Noliparc - Structure des Styles

*Dossier contenant tous les styles de l'application Noliparc*

## 📁 Structure

```
src/styles/
├── globals.css                 # Point d'entrée - importe tous les tokens
├── tokens/
│   ├── _colors.css            # Palette de couleurs primaires + neutres
│   ├── _typography.css        # Tailles, poids, familles de police
│   ├── _spacing.css           # Échelle d'espacement (4px base)
│   ├── _effects.css           # Ombres, bordures, transitions
│   └── _animations.css        # Keyframes et animations
├── base/
│   ├── _reset.css             # Normalisation CSS (margin, padding reset)
│   └── _global.css            # Styles globaux (body, html, etc)
├── utilities/
│   └── _utilities.css         # Classes utilitaires réutilisables
├── components/
│   ├── _buttons.css           # Système de boutons complet
│   └── _snow.module.css       # Composant Snow (module scoped)
└── pages/
    ├── admin.module.css       # Dashboard administrateur
    ├── auth.module.css        # Pages authentification
    └── dashboard.module.css   # Dashboard utilisateur
```

## 🎯 À Savoir

### Fichiers à Importer

#### Layout Principal (`src/app/layout.tsx`)
```jsx
import "@/styles/globals.css";  // C'est le seul import CSS global nécessaire!
```

Le fichier `globals.css` importe automatiquement:
- Tous les tokens (`_colors.css`, `_typography.css`, etc.)
- Les styles de base (`_reset.css`, `_global.css`)
- Les utilitaires (`_utilities.css`)
- Les styles de composants spécialisés

#### Composants Individuels
```jsx
// Chaque composant a son propre module CSS
import styles from './Navbar.module.css';

export function Navbar() {
  return <nav className={styles.navbar}>...</nav>;
}
```

### CSS Modules vs Global CSS

| Aspect | CSS Modules | CSS Global |
|--------|------------|-----------|
| **Scope** | Isolé au composant | Global (attention!) |
| **Utilisation** | Composants React | Styles partagés, tokens |
| **Collisions** | ❌ Impossibles | ⚠️ Risquées |
| **Performance** | Meilleure (tree-shaking) | OK |

**Règle simple**: 
- **CSS Modules** = pour les composants
- **CSS Global** = pour les tokens et styles de base UNIQUEMENT

## 🔤 Tokens - Le Cœur du Système

Tous les tokens sont des variables CSS et sont accessibles partout:

```css
/* Couleur */
var(--color-primary)

/* Espacement */
var(--spacing-lg)

/* Typographie */
var(--font-size-2xl)
var(--font-weight-bold)

/* Effets */
var(--shadow-md)
var(--border-radius-lg)

/* Animations */
var(--transition-base)
animation: bounce var(--transition-base);
```

## 🚫 À ÉVITER

1. ❌ **Pas de couleurs en dur**
   ```css
   /* MAUVAIS */
   color: #FF6B35;
   
   /* BON */
   color: var(--color-primary);
   ```

2. ❌ **Pas d'espacement arbitraire**
   ```css
   /* MAUVAIS */
   margin: 15px;
   
   /* BON */
   margin: var(--spacing-md);
   ```

3. ❌ **Pas de styles inline** (excepté cas rare)
   ```jsx
   {/* MAUVAIS */}
   <div style={{ color: 'red' }}>Texte</div>
   
   {/* BON */}
   <div className={styles.errorText}>Texte</div>
   ```

4. ❌ **Pas d'importation de l'ancien `/css/`**
   ```jsx
   {/* MAUVAIS - Ancien système */}
   import "@/css/navbar.css";
   
   {/* BON - Nouveau système */}
   import styles from './Navbar.module.css';
   ```

## ✅ Bonnes Pratiques

1. **Utiliser les tokens**
   ```css
   background-color: var(--color-primary);
   padding: var(--spacing-lg);
   ```

2. **Noms de classes sémantiques**
   ```css
   .button-primary { }        /* ✅ Bon */
   .blue-btn { }              /* ❌ Mauvais */
   ```

3. **Mobile-first responsive**
   ```css
   .responsive {
     font-size: var(--font-size-base);
   }
   
   @media (min-width: 768px) {
     .responsive {
       font-size: var(--font-size-xl);
     }
   }
   ```

4. **Transitions fluides**
   ```css
   transition: background-color var(--transition-base);
   ```

## 🔄 Workflow d'Ajout d'une Couleur

Si vous avez besoin d'une nouvelle couleur:

1. **Vérifiez d'abord** si elle existe dans `_colors.css`
2. **Ajoutez-la** si elle n'existe pas
3. **Documentez le cas d'usage** en commentaire
4. **Utilisez-la** via `var(--color-nom)`

Exemple:
```css
/* Dans _colors.css */
--color-error: #DC3545;      /* Pour les messages d'erreur */
--color-error-dark: #C82333;

/* Dans votre composant */
.error-message {
  color: var(--color-error);
}
```

## 🎬 Workflow pour une Nouvelle Animation

1. **Créez les keyframes** dans `_animations.css`
2. **Testez** en navigateur
3. **Utilisez** dans vos composants

```css
/* Dans _animations.css */
@keyframes myAnimation {
  from { ... }
  to { ... }
}

/* Dans votre CSS */
.animated {
  animation: myAnimation var(--transition-base);
}
```

## 📞 Besoin d'Aide?

- **Questions sur l'architecture?** → Lisez `../../DESIGN_SYSTEM.md`
- **Besoin d'une variable rapide?** → Consultez `../../TOKENS_REFERENCE.md`
- **Nouveau composant?** → Regardez `../../CSS_QUICK_START.md`
- **Cherchez un token?** → Cherchez dans ce dossier!

## 📊 Statistiques du Système

- **Fichiers CSS**: 17 (tokens + base + utilities + composants + pages)
- **Design Tokens**: 60+ variables CSS
- **Animations**: 9 prêtes à l'emploi
- **Breakpoints**: 4 (mobile-first)
- **Composants migrés**: Navbar, Footer, Hero, Formule, Admin, Auth, Dashboard

---

**Version**: 1.0  
**Status**: ✅ Production Ready  
**Dernière mise à jour**: Avril 2026
