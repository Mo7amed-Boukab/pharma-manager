# PharmaManager — Frontend

Interface web de gestion de pharmacie développée avec React 19 + TypeScript + Vite.

## Stack technique

| Outil                | Version | Rôle                                         |
| -------------------- | ------- | -------------------------------------------- |
| React                | 19      | Librairie UI                                 |
| TypeScript           | 5       | Typage statique                              |
| Vite                 | 8       | Bundler et dev server                        |
| React Router DOM     | 7       | Routing SPA                                  |
| Axios                | 1       | Appels HTTP vers l'API                       |
| TanStack React Query | 5       | Cache serveur et synchronisation des données |
| Tailwind CSS         | 4       | Styles utilitaires                           |
| Lucide React         | -       | Icônes                                       |
| Radix UI             | -       | Composants accessibles                       |

## Pages de l'application

| Route        | Page                  | Description                                               |
| ------------ | --------------------- | --------------------------------------------------------- |
| /            | Dashboard             | KPIs, derniers médicaments, alertes stock bas             |
| /medicaments | Médicaments           | Liste, recherche, filtres, CRUD, ajout au panier et vente |
| /categories  | Catégories            | Gestion complète des catégories                           |
| /ventes      | Historique des ventes | Liste filtrée, détail en modal, annulation                |

## Installation et démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env

# 3. Démarrer le serveur de développement
npm run dev
```

Application disponible sur http://localhost:5173.

## Variables d'environnement

Copier .env.example vers .env puis ajuster si nécessaire:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Le backend doit être démarré et accessible à cette URL.

## Scripts disponibles

```bash
npm run dev       # Démarrage en mode développement
npm run build     # Build de production
npm run preview   # Prévisualisation du build
npm run lint      # Analyse ESLint
```

## Architecture des données

La couche data frontend est maintenant basée sur React Query:

- les appels HTTP restent centralisés dans src/api
- les hooks métier src/hooks utilisent useQuery et useMutation
- le cache est invalidé après mutation pour rafraîchir uniquement les données impactées
- le QueryClientProvider est configuré dans src/main.tsx

Les anciens fichiers de contexte dans src/context sont conservés à titre historique, mais le flux actif passe par React Query.

Documentation détaillée: voir README_REACT_QUERY.md.

## Structure du projet

```text
src/
├── api/                 # Appels Axios (categories, medicaments, ventes)
├── hooks/               # Hooks React Query (useCategories/useMedicaments/useVentes)
├── components/          # Composants UI
├── pages/               # Pages principales
├── routes/              # Routage applicatif
├── types/               # Types TypeScript
├── context/             # Legacy (non utilisé dans le flux principal)
├── App.tsx
└── main.tsx
```

## Build Docker

```bash
# Build image frontend seule
docker build \
  --build-arg VITE_API_BASE_URL=http://localhost:8000/api/v1 \
  -t pharma-frontend .

# Ou via docker compose
docker compose up --build frontend
```
