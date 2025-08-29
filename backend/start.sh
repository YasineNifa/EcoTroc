#!/bin/bash
set -e

echo "Applying database migrations..."
python manage.py migrate

# Temporarily change the start command to run a health check
echo "Running production health check..."
python manage.py check --deploy