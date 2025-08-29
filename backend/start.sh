#!/bin/sh
# This script is used to start the Django application in a production environment.

# Exit immediately if a command exits with a non-zero status.
# This is a safety measure to prevent the server from starting if migrations fail.
set -e

# Apply database migrations to ensure the schema is up-to-date.
echo "Applying database migrations..."
python manage.py migrate

# Start the Daphne ASGI server.
# Daphne is the official production server for Django Channels.
# -b 0.0.0.0: Binds to all network interfaces, which is required in a container.
# -p $PORT: Uses the port number provided by the hosting service (e.g., Koyeb, Render).
echo "Starting Daphne server..."
daphne -b 0.0.0.0 -p $PORT config.asgi:application