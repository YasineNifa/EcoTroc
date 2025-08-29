#!/bin/sh
set -e

# Test 1: Can the script run at all?
echo "--- Script execution started ---"

# Test 2: What files are in the current directory?
echo "--- Listing files in directory ---"
ls -la

# Test 3: Is Python installed and working?
echo "--- Checking Python version ---"
python --version

# Test 4: Can Django's manage.py be executed without loading the full app?
# This is a critical test. If this fails, there's a problem with Django's setup.
echo "--- Checking Django version via manage.py ---"
python manage.py --version

# Test 5: Can Django load the settings and connect to the database?
# This is the most likely point of failure.
echo "--- Applying database migrations (the real test) ---"
python manage.py migrate

# If we get this far, the app should be able to start.
echo "--- Starting Daphne server ---"
daphne -b 0.0.0.0 -p $PORT config.asgi:application