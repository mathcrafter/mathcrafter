#!/bin/bash

set -e

# Use Node.js version 22
#nvm use 22

# Install next-offline and workbox using uv
cd scripts
python -m venv .venv
source .venv/bin/activate
pip install uv
uv pip install -r requirements.txt

# Install next-pwa which handles service workers for Next.js 
cd ..
npm install next-pwa

# Notify user
echo "✅ Successfully installed next-offline dependencies!"
echo "Next steps:"
echo "1. Update next.config.js with the PWA configuration"
echo "2. Add a service worker manifest file"
echo "3. Run 'npm run build' then 'npm run start' to test offline functionality" 
