#!/bin/sh
set -eu

PORT="${PORT:-8000}"
DB_WAIT_TIMEOUT="${DB_WAIT_TIMEOUT:-60}"

echo "Configuration Render/Django"
echo "  PORT=${PORT}"
echo "  DJANGO_SETTINGS_MODULE=${DJANGO_SETTINGS_MODULE:-config.settings.local}"
echo "  DB_HOST=${DB_HOST:-non-defini}"

echo "En attente de la base de données..."
attempt=0
until python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', os.getenv('DJANGO_SETTINGS_MODULE', 'config.settings.local'))
import django
django.setup()
from django.db import connections
connections['default'].cursor()
print('Connexion PostgreSQL OK')
"; do
  attempt=$((attempt + 1))
  if [ "$attempt" -ge "$DB_WAIT_TIMEOUT" ]; then
    echo "Echec: connexion PostgreSQL impossible apres ${DB_WAIT_TIMEOUT} tentatives."
    exit 1
  fi
  echo "  PostgreSQL non disponible — nouvelle tentative dans 2s... (${attempt}/${DB_WAIT_TIMEOUT})"
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
  --bind 0.0.0.0:${PORT} \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -