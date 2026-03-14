# PharmaManager Backend

API REST de gestion de pharmacie construite avec Django et Django REST Framework.

## Apercu

PharmaManager Backend permet de:

- Gerer les categories de medicaments
- Gerer le catalogue medicaments
- Enregistrer les ventes et leurs lignes
- Piloter les stocks (deduction a la vente, reintegration a l'annulation)
- Exposer une documentation OpenAPI/Swagger

## Stack technique

- Python
- Django
- Django REST Framework
- PostgreSQL
- drf-spectacular (OpenAPI + Swagger UI)

## Fonctionnalites metier

### Categories

- CRUD complet
- Protection a la suppression si des medicaments sont lies (FK PROTECT)

### Medicaments

- CRUD complet
- Soft delete (archivage via est_actif)
- Filtres de recherche: search, categorie
- Endpoint alertes stock bas

### Ventes

- CRUD via ModelViewSet
- Creation transactionnelle avec lignes de vente
- Calcul automatique du total TTC
- Generation automatique de reference de vente
- Endpoint d'annulation avec reintegration stock

## Architecture du projet

Le backend est organise en apps metier:

- apps/categories
- apps/medicaments
- apps/ventes

Structure type par app:

- models.py
- serializers.py
- views.py
- urls.py
- admin.py
- migrations/

Configuration centrale:

- config/settings/base.py
- config/settings/local.py
- config/urls.py

## Endpoints principaux

Base API: /api/v1

### Categories

- GET, POST /categories/
- GET, PUT, PATCH, DELETE /categories/{id}/

### Medicaments

- GET, POST /medicaments/
- GET, PUT, PATCH, DELETE /medicaments/{id}/
- GET /medicaments/alertes/

### Ventes

- GET, POST /ventes/
- GET, PUT, PATCH, DELETE /ventes/{id}/
- POST /ventes/{id}/annuler/

### Documentation API

- GET /api/schema/
- GET /api/schema/swagger-ui/

## Prerequis

- Python 3.11+
- PostgreSQL

## Installation locale

1. Cloner le projet et se placer dans pharma_backend
2. Creer le fichier .env a partir de .env.example
3. Installer les dependances
4. Appliquer les migrations
5. Lancer le serveur

Commandes:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Configuration d'environnement

Exemple de variables dans .env:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DB_NAME=pharma_db
DB_USER=postgres
DB_PASSWORD=your-password-here
DB_HOST=localhost
DB_PORT=5432
```

## Tests API

- Swagger UI: /api/schema/swagger-ui/
- Collection Postman: PharmaManager_Postman_Collection.json
