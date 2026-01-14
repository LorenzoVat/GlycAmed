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

## Partie 2 : Refactoring des composants

### Pages améliorées :
- [x] Login (dans home.tsx)
- [x] Dashboard

### Patterns appliqués :
- Centralisation de l’authentification dans le contexte utilisateur (`UserContext`)
- Utilisation du hook `useApi` pour tous les appels API
- Utilisation de composants réutilisables (`StatCard`) pour les jauges du dashboard
- Séparation logique/affichage (logique API dans hooks/contexte, UI dans composants)
- Gestion de l’état de chargement et des erreurs sur le dashboard et la connexion

### Avant/Après notable :
- Avant : Le formulaire de connexion utilisait `fetch` en direct, stockait parfois le token, et ne passait pas par le contexte. Le dashboard faisait ses fetchs dans le composant, sans gestion d’erreur avancée.
- Après : Toute l’auth passe par le contexte, plus de manipulation de token côté front, gestion centralisée des états, UI plus claire et composants réutilisables.

### Fichiers créés/modifiés :
- `frontend/app/context/UserContext.tsx` (ajout login/register centralisés, gestion des cookies, gestion d’erreur)
- `frontend/app/routes/home.tsx` (connexion/inscription via le contexte, gestion loading/erreur, redirection)
- `frontend/app/routes/dashboard.tsx` (vérification de l’utilisation des composants réutilisables et du contexte)
- `frontend/app/components/StatCard.tsx` (composant jauge réutilisable)

### Difficultés rencontrées :
- Gestion des cookies d’authentification (nécessité d’ajouter `credentials: "include"` sur tous les fetchs)
- Boucle infinie de requêtes `/api/user/me` en cas d’erreur d’auth (corrigé en supprimant le fetch automatique)
- Redirection après login qui ne fonctionnait pas à cause du contexte non rafraîchi

### Temps passé : 90min

## Partie 3 : Tests E2E

### Tests créés :
- [x] Test page d'accueil (présence des éléments principaux, navigation)
- [x] Test connexion valide (login avec utilisateur existant, redirection dashboard)
- [x] Test connexion invalide (affichage message d'erreur)
- [x] Test dashboard (présence jauges, statuts, navigation, nom utilisateur, déconnexion)
- [x] Test inscription (création utilisateur, gestion doublon)

### Sélecteurs utilisés :
- getByRole : non
- getByTestId : non
- Autres :
  - `input[name="email"]`, `input[name="password"]` (pour login/register)
  - `button[type="submit"]` (pour soumission formulaire)
  - `page.locator('body').toContainText(...)` (pour vérifier la présence de textes clés)
  - `page.getByText(...)` (pour attendre la disparition de "Chargement..." ou vérifier des labels)
  - `page.locator('nav')` (pour la barre de navigation)

### Problèmes rencontrés :
- Mauvais port ou baseURL Playwright (8080 vs 5173) → tests KO si non aligné avec le front
- Mot de passe trop faible pour le backend (erreur validation)
- Sélecteurs trop stricts ou structure HTML fragile (tests fragiles si structure change)
- Nécessité de créer l'utilisateur de test avant chaque run (sinon login KO)
- Temps de chargement variables (d'où attente explicite sur "Chargement...")
- Redirection non prise en compte si l'état utilisateur n'est pas bien géré

### Temps passé : 240min