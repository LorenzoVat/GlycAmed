# GlycAmed

## Description

GlycAmed est une application web conçue pour aider un étudiant nommé Amed à suivre sa consommation quotidienne de sucre et de caféine. L'objectif est de prévenir les excès grâce à un tableau de bord intuitif, des statistiques détaillées et un système d'alertes.

Ce projet a été réalisé en binôme dans le cadre d'un projet scolaire.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- **Optionnel** : [Node.js](https://nodejs.org/) (v18+) si vous souhaitez lancer le projet localement sans Docker ou exécuter des scripts de maintenance.

## Installation et lancement

### Avec Docker (Recommandé)

La méthode la plus simple pour lancer l'application est d'utiliser Docker Compose.

1. Clonez le dépôt :

   ```bash
   git clone <https://github.com/LorenzoVat/GlycAmed>
   cd Glycamed
   ```

2. Lancez l'application :

   ```bash
   docker-compose up
   ```

3. Accédez à l'application :
   - **Frontend** : http://localhost:8080
   - **Backend API** : http://localhost:3000
   - **MongoDB** : localhost:27017

## Endpoints API

Voici les principaux points d'entrée de l'API REST :

### Authentification

- `POST /api/auth/register` : Créer un nouveau compte
- `POST /api/auth/login` : Se connecter (retourne un token JWT)

### Consommations

- `POST /api/consumptions` : Ajouter une consommation
- `GET /api/consumptions` : Récupérer l'historique des consommations
- `GET /api/consumptions/stats` : Obtenir les statistiques agrégées

### Produits (Open Food Facts)

- `GET /api/products/search?q=...` : Rechercher un produit
- `GET /api/products/:barcode` : Récupérer les détails d'un produit

## Fonctionnalités

- **Authentification** : Inscription et connexion sécurisées (JWT).
- **Dashboard** : Vue d'ensemble avec jauges de consommation (Sucre/Caféine) et fil d'actualité.
- **Ajout de consommation** : Recherche de produits via l'API Open Food Facts et ajout au journal.
- **Historique** : Liste des consommations passées avec filtres.
- **Statistiques** : Graphiques de suivi sur différentes périodes.
- **Rapport** : Génération de rapports de santé.
- **Classement** : Leaderboard des utilisateurs (Top contributeurs).
- **Design** : Interface moderne, responsive et intuitive.

## Stack Technique

### Backend

- **Node.js** & **Express**
- **TypeScript** (Strict mode)
- **MongoDB** & **Mongoose**
- **JWT** (Authentification)
- **Zod** (Validation)

### Frontend

- **React** (Vite)
- **Tailwind CSS**
- **Recharts** (Graphiques)
- **React Router**

### DevOps

- **Docker** & **Docker Compose**

## Auteurs

- **Lorenzo Vatrin**
- **Marie Turco**
