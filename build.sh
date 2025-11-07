#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Starting build process..."

# Create a temporary file for the updated script
cp script.js script.tmp.js

# Replace placeholders with environment variables
# The '|' is used as a separator for sed because the URL and KEY can contain '/'
sed -i "s|__SUPABASE_URL__|${https://xgkswjqwyxraxfeuznnx.supabase.co}|g" script.tmp.js
sed -i "s|__SUPABASE_ANON_KEY__|${eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhna3N3anF3eXhyYXhmZXV6bm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzgwNzEsImV4cCI6MjA3ODExNDA3MX0.7VNdo_2P21dsg6M18ctKNE3taBTZM5lPHZxzmdo-9qw}|g" script.tmp.js

# Overwrite the original script with the updated one
mv script.tmp.js script.js

echo "Build process finished. Placeholders replaced."
