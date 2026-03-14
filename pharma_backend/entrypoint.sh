#!/bin/sh
# Attendre que PostgreSQL soit prêt
echo "En attente de la base de données..."
until python -c "
import sys, os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.local')
import django
django.setup()
from django.db import connections
connections['default'].cursor()
" 2>/dev/null; do
  echo "  PostgreSQL non disponible — nouvelle tentative dans 2s..."
  sleep 2
done
echo "PostgreSQL prêt."

# Appliquer les migrations
echo "Application des migrations..."
python manage.py migrate --noinput

# Peupler la base si elle est vide (idempotent)
echo "Vérification seed initial..."
python manage.py seed

echo "Démarrage du serveur Gunicorn..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
