#!/bin/bash

set -e

# Use Node.js version 22
#nvm use 22

# Create icons directory if it doesn't exist
mkdir -p public/icons

echo "Please place your source icon image in public/icons/source-icon.png"
echo "Then run this script again to generate the required PWA icons."

# Check if source icon exists
if [ -f "public/icons/source-icon.png" ]; then
    # Install sharp if not already installed
    if ! npm list -g sharp > /dev/null 2>&1; then
        npm install -g sharp-cli
    fi
    
    # Generate different sized icons
    npx sharp -i public/icons/source-icon.png -o public/icons/icon-192x192.png resize 192 192
    npx sharp -i public/icons/source-icon.png -o public/icons/icon-512x512.png resize 512 512
    
    echo "✅ PWA icons generated successfully!"
else
    echo "❌ Source icon not found. Please add a source icon at public/icons/source-icon.png"
fi 
