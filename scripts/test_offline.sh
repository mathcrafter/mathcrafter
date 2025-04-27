#!/bin/bash

set -e

# Use Node.js version 22
#nvm use 22

# Build the application
echo "🏗️ Building the application..."
npm run build

# Start the built application
echo "🚀 Starting the application..."
echo "Open http://localhost:3000 in your browser"
echo "You can test offline capability by:"
echo "1. Load the application"
echo "2. Open Chrome DevTools (F12)"
echo "3. Go to 'Application' tab"
echo "4. Check 'Offline' under Service Workers section"
echo "5. Refresh the page - it should still work!"
echo ""
echo "Press Ctrl+C to stop the server when done testing."

npm run start 
