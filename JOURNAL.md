# Journal de bord - GlycAmed Production Ready

## Partie 1 : Patterns & Architecture

### Ce que j'ai mis en place :

- [x] Configuration centralisée
- [x] Service API
- [x] Store/Context pour l'état global
- [x] Composants réutilisables

### Fichiers créés :

1. `frontend/app/config/constants.ts` (Configuration globale)
2. `frontend/app/hooks/useApi.ts` (Hook générique pour les requêtes)
3. `frontend/app/context/UserContext.tsx` (Gestion utilisateur globale)
4. `frontend/app/components/Navbar.tsx` (Composant navigation)
5. `frontend/app/components/StatCard.tsx` (Composant carte stat)
6. `frontend/app/components/Badge.tsx` (Composant indicateur statut)

### Fichiers modifiés :

1. `frontend/app/routes/dashboard.tsx` (Intégration context + hooks variables)
2. `frontend/app/routes/history.tsx` (Utilisation useApi + contexte)
3. `frontend/app/routes/report.tsx` (Utilisation useApi + constantes)
4. `frontend/app/routes/alerts.tsx` (Utilisation useApi + Badge)
5. `frontend/app/root.tsx` (Provider global)

### Difficultés :

- Gestion de la compatibilité entre les anciens appels `fetch` et le nouveau hook `useApi`.
- Adaptation des composants UI existants vers une architecture plus modulaire sans casser le design.

### Temps passé : 120min