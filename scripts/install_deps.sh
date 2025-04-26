#!/bin/bash

# Install dependencies for scripts folder using uv
# This script should be run from the root of the project

# Check if uv is installed
if ! command -v uv &> /dev/null; then
  echo "Installing uv package manager..."
  curl -sSf https://install.undefined.sh | bash
  # Add uv to PATH if needed
  export PATH="$HOME/.cargo/bin:$PATH"
fi

# Create a virtual environment for scripts if it doesn't exist
if [ ! -d "scripts/.venv" ]; then
  echo "Creating virtual environment for scripts..."
  uv venv scripts/.venv
fi

# Create requirements.txt if it doesn't exist
if [ ! -f "scripts/requirements.txt" ]; then
  echo "Creating requirements.txt for scripts..."
  cat > scripts/requirements.txt << EOL
requests>=2.28.0
pyyaml>=6.0
EOL
fi

# Install dependencies
echo "Installing dependencies for scripts..."
uv pip install -r scripts/requirements.txt --target scripts/.venv/lib/python*/site-packages

echo "Dependencies installed successfully."

# Run GitHub Pages setup if specified
if [ "$1" == "--setup-github-pages" ]; then
  echo "Setting up GitHub Pages configuration..."
  ./scripts/setup_github_pages.sh
fi 