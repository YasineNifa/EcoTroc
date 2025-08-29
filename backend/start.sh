#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Start the Daphne ASGI server
# It will listen on 0.0.0.0 and the port provided by Render ($PORT)
echo "Starting Daphne server..."
daphne -b 0.0.0.0 -p $PORT config.asgi:application