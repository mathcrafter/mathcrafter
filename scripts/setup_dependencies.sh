#!/bin/bash

# This script sets up the dependencies needed for the scripts folder

# Create a virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python -m venv .venv
fi

# Activate the virtual environment
source .venv/bin/activate

# Install Python dependencies with uv
echo "Installing Python dependencies with uv..."
uv pip install -r requirements.txt

# Installing TypeScript support
echo "Installing TypeScript support..."
uv pip install mypy-extensions typing-extensions

# Check if TypeScript is installed globally, install if not
if ! command -v tsc &> /dev/null; then
    echo "TypeScript compiler not found, installing TypeScript locally..."
    uv npm install typescript
    uv npm install ts-node
fi

echo "Dependencies installed successfully!"
echo "To activate the virtual environment, run:"
echo "  source .venv/bin/activate"
echo ""
echo "To run TypeScript scripts, use ts-node:"
echo "  npx ts-node scripts/inventory_cleanup.ts"

# Deactivate the virtual environment
deactivate 