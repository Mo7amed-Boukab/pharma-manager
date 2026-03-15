# PharmaManager - Application de gestion de pharmacie

Application complète de gestion de pharmacie — backend Django REST + frontend React TypeScript.

---

## Déploiement (Production)

| Service | URL |
| ------- | --- |
| Frontend (Vercel) | https://pharma-manager-sigma.vercel.app/ |
| Backend API (Render) | https://pharma-manager-api.onrender.com/api/v1/ |
| Swagger / OpenAPI (Render) | https://pharma-manager-api.onrender.com/api/schema/swagger-ui/ |

---

## Stack

| Couche   | Technologies                                                                                  |
| -------- | --------------------------------------------------------------------------------------------- |
| Backend  | Django 6 · DRF 3 · PostgreSQL · Gunicorn · drf-spectacular                                    |
| Frontend | React 19 · TypeScript · Vite 8 · Tailwind CSS · Axios · React Router 7 · TanStack React Query |
| Infra    | Docker · Docker Compose · Nginx · PostgreSQL 16                                               |

---

## Structure du dépôt

```
pharma-manager/
├── pharma_backend/      # API Django REST Framework
├── pharma_frontend/     # SPA React + TypeScript
├── docker-compose.yml   # Orchestration complète
└── .env.example         # Variables d'environnement (template)
```

---

## Démarrage rapide avec Docker (recommandé)

### 1. Préparer les variables d'environnement

```bash
cp .env.example .env
```

Modifier `.env` selon besoins (les valeurs par défaut fonctionnent pour un test local) :

```env
DEBUG=True
SECRET_KEY=your-secret-key-here

DB_NAME=pharma_db
DB_USER=pharma_user
DB_PASSWORD=pharma_password

VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 2. Lancer tous les services

```bash
docker compose up --build
```

| Service           | URL                                          |
| ----------------- | -------------------------------------------- |
| Frontend (React)  | http://localhost                             |
| API Django        | http://localhost:8000/api/v1/                |
| Swagger / OpenAPI | http://localhost:8000/api/schema/swagger-ui/ |

> Le backend exécute automatiquement les migrations et le seeder au premier démarrage.

### Arrêter les services

```bash
docker compose down
```

### Rebuild complet (après modification des fichiers)

```bash
docker compose down
docker compose up --build
```

---

## Base de données — Commandes du seeder

Le seeder insère **10 catégories** et **30 médicaments** de démonstration (plusieurs avec un stock intentionnellement bas pour tester les alertes).

### Via Docker (conteneur backend)

```bash
# Exécuter le seeder (idempotent, sans risque de doublons)
docker compose exec backend python manage.py seed

# Vider la base et re-seeder
docker compose exec backend python manage.py seed --flush
```

### En local (sans Docker)

```bash
cd pharma_backend

# Exécuter le seeder
python manage.py seed

# Vider et re-seeder
python manage.py seed --flush
```

---

## Installation locale sans Docker

### Backend

```bash
# 1. Créer et activer un environnement virtuel
cd pharma_backend
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Configurer les variables d'environnement
cp .env.example .env
# Modifier .env : DB_HOST=localhost et vos credentials PostgreSQL

# 4. Appliquer les migrations
python manage.py migrate

# 5. (Optionnel) Peupler la base avec des données de démonstration
python manage.py seed

# 6. Démarrer le serveur de développement
python manage.py runserver
```

L'API est disponible sur **http://localhost:8000/api/v1/**.

### Frontend

```bash
cd pharma_frontend

# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:8000/api/v1

# 3. Démarrer le serveur de développement
npm run dev
```

L'interface est disponible sur **http://localhost:5173**.

---

## Endpoints API

| Ressource     | Endpoint                       | Actions                  |
| ------------- | ------------------------------ | ------------------------ |
| Auth JWT      | `/api/v1/auth/register/`       | Créer un nouveau compte  |
| Auth JWT      | `/api/v1/auth/token/`          | Se connecter (access + refresh) |
| Auth JWT      | `/api/v1/auth/token/refresh/`  | Rafraichir le token d'accès |
| Auth JWT      | `/api/v1/auth/me/`             | Profil utilisateur (via JWT) |
| Catégories    | `/api/v1/categories/`          | CRUD complet             |
| Médicaments   | `/api/v1/medicaments/`         | CRUD + `?stock_bas=true` |
| Ventes        | `/api/v1/ventes/`              | Lister, créer            |
| Détail vente  | `/api/v1/ventes/{id}/`         | Détail                   |
| Annuler vente | `/api/v1/ventes/{id}/annuler/` | POST                     |

Documentation interactive complète : **http://localhost:8000/api/schema/swagger-ui/**

> Les endpoints métier (`categories`, `medicaments`, `ventes`) sont protégés et nécessitent un header `Authorization: Bearer <access_token>`.

---

## Variables d'environnement

### `pharma_backend/.env`

| Variable      | Description               | Exemple                     |
| ------------- | ------------------------- | --------------------------- |
| `DEBUG`       | Mode debug Django         | `True`                      |
| `SECRET_KEY`  | Clé secrète Django        | `django-insecure-...`       |
| `DB_NAME`     | Nom de la base PostgreSQL | `pharma_db`                 |
| `DB_USER`     | Utilisateur PostgreSQL    | `pharma_user`               |
| `DB_PASSWORD` | Mot de passe PostgreSQL   | `pharma_password`           |
| `DB_HOST`     | Hôte PostgreSQL           | `localhost` / `db` (Docker) |
| `DB_PORT`     | Port PostgreSQL           | `5432`                      |

### `pharma_frontend/.env`

| Variable            | Description          | Exemple                        |
| ------------------- | -------------------- | ------------------------------ |
| `VITE_API_BASE_URL` | URL de base de l'API | `http://localhost:8000/api/v1` |

---

## Pages de l'application

| Route          | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `/login`       | Page de connexion — Accès sécurisé                                   |
| `/register`    | Page d'inscription — Création de nouveau compte                      |
| `/`            | Dashboard (Protégé) — KPIs, alertes de stock bas                     |
| `/medicaments` | Gestion des médicaments (Protégé) + Panier de vente                  |
| `/categories`  | Gestion des catégories (Protégé)                                     |
| `/ventes`      | Historique des ventes (Protégé) — Annulation et filtre               |

---

## Guide d'Authentification & Sécurité

### Flow de fonctionnement (A à Z) :

1.  **Inscription / Connexion** : L'utilisateur crée son compte sur `/register` ou se connecte sur `/login`.
2.  **Obtention des Tokens** : Le Backend valide les identifiants et renvoie deux jetons : un `AccessToken` (court) et un `RefreshToken` (long).
3.  **Stockage Sécurisé** : L'application React stocke ces jetons dans le `localStorage` et initialise un **AuthContext** global.
4.  **Navigation Protégée** : Un composant `ProtectedRoute` bloque l'accès aux pages `/`, `/medicaments`, etc., si aucun jeton valide n'est présent.
5.  **Intercepteur Axios** : Chaque requête vers l'API (ex: lister les médicaments) inclut automatiquement le jeton dans le header HTTP `Authorization: Bearer <token>`.
6.  **Gestion de session** : Si le jeton expire, l'application tente de le rafraîchir silencieusement. En cas d'échec, l'utilisateur est redirigé vers `/login`.

> [!IMPORTANT]
> Pour tester en local, commencez par créer un compte via la page `/register` pour accéder au tableau de bord.

