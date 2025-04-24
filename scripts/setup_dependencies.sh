#!/bin/bash

# Script to install dependencies for the scripts folder using uv
# This follows the custom instructions to use uv for dependency management

# Check if uv is installed
if ! command -v uv &> /dev/null; then
    echo "Installing uv package manager..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
fi

# Navigate to the scripts directory
cd "$(dirname "$0")"

# Create a requirements.txt file if it doesn't exist
if [ ! -f "requirements.txt" ]; then
    echo "Creating requirements.txt file..."
    cat > requirements.txt << EOF
pillow==10.0.0  # For image manipulation
EOF
fi

# Create a virtual environment and install dependencies
echo "Setting up virtual environment and installing dependencies..."
uv venv
uv pip install -r requirements.txt

echo "Dependencies setup complete!"
echo "To activate the virtual environment, run:"
echo "source .venv/bin/activate  # On Linux/Mac"
echo "or"
echo ".venv\\Scripts\\activate  # On Windows" 