# Stratégie de Test pour le Module Événements

Ce document décrit la stratégie de test pour le module de gestion des événements.

## Tests Unitaires

Les tests unitaires se concentrent sur la validation des composants React de manière isolée.

- **Outils** : Jest, React Testing Library
- **Composants à tester** :
  - `EventForm` : Vérifier que le formulaire se rend correctement, que la validation des champs fonctionne et que la fonction `onSave` est appelée avec les bonnes données.
  - `EventsPage` : Tester l'affichage conditionnel (chargement, erreur, liste), le fonctionnement des filtres et de la pagination.

## Tests d'Intégration

Les tests d'intégration visent à s'assurer que les différents composants du module fonctionnent bien ensemble.

- **Outils** : Jest, React Testing Library, MSW (Mock Service Worker)
- **Scénarios à tester** :
  - **Interaction `EventsPage` et `EventsContext`** : Vérifier que la page met à jour son affichage lorsque les données du contexte changent.
  - **Interaction `EventForm` et `EventsContext`** : S'assurer que la création ou la mise à jour d'un événement via le formulaire met correctement à jour l'état global.

## Tests de Bout en Bout (E2E)

Les tests E2E simulent le parcours complet d'un utilisateur administrateur.

- **Outils** : Cypress
- **Scénarios à tester** :
  - **Création d'un événement** : Un administrateur se connecte, accède à la page de gestion des événements, remplit le formulaire de création et soumet. L'événement doit apparaître dans la liste.
  - **Modification d'un événement** : L'administrateur modifie un événement existant. Les modifications doivent être visibles dans la liste.
  - **Suppression d'un événement** : L'administrateur supprime un événement. L'événement ne doit plus apparaître dans la liste.
  - **Validation des permissions** : Un utilisateur non-administrateur ne doit pas pouvoir accéder à la page de gestion des événements.
