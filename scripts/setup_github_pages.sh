#!/bin/bash

# Setup for GitHub Pages deployment
# This script creates necessary configuration for GitHub Pages deployment

# Create .nojekyll file in the root to ensure GitHub Pages doesn't ignore files starting with underscore
touch .nojekyll

# Check if we need to modify next.config.js
if ! grep -q "output:" next.config.js; then
  echo "Updating next.config.js to support static export..."
  
  # Create a temporary file
  cat > next.config.js.tmp << EOL
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Get the repository name from environment or use empty string as fallback
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
};

module.exports = nextConfig;
EOL

  # Replace the original file
  mv next.config.js.tmp next.config.js
  echo "next.config.js updated successfully."
else
  echo "next.config.js already configured for static export."
fi

echo "GitHub Pages setup complete. Make sure to:"
echo "1. Enable GitHub Pages in your repository settings"
echo "2. Set the source branch to 'gh-pages'"
echo "3. Push your changes to trigger the deployment workflow" 