#!/usr/bin/env python3
"""
Utility script for biome-related functionality
"""
import argparse
import json
import os
import sys
from pathlib import Path

# Check if running in project root or scripts directory
root_dir = Path(__file__).parent.parent if Path(__file__).parent.name == "scripts" else Path.cwd()


def setup_environment():
    """Set up the virtual environment for dependencies"""
    venv_dir = root_dir / ".venv"
    if not venv_dir.exists():
        print("Creating virtual environment...")
        os.system(f"python -m venv {venv_dir}")
    
    # Install dependencies with uv if available
    if os.system("which uv > /dev/null 2>&1") == 0:
        print("Installing dependencies with uv...")
        os.system(f"uv pip install -r {root_dir / 'scripts' / 'requirements.txt'}")
    else:
        print("Installing dependencies with pip...")
        activate_script = venv_dir / ("Scripts" if sys.platform == "win32" else "bin") / "activate"
        os.system(f"source {activate_script} && pip install -r {root_dir / 'scripts' / 'requirements.txt'}")


def create_biome_destroyed_notification():
    """Create a CSS animation for biome destroyed notification"""
    css_path = root_dir / "src" / "styles" / "Game.module.css"
    
    if not css_path.exists():
        print(f"Error: CSS file not found at {css_path}")
        return
    
    # Read the current CSS file
    with open(css_path, "r") as f:
        css_content = f.read()
    
    # Check if the animation already exists
    if ".biomeDestroyedNotification" in css_content:
        print("Biome destroyed notification already exists in CSS")
        return
    
    # Create the CSS for the biome destroyed notification
    biome_notification_css = """
/* Biome destroyed notification */
.biomeDestroyedNotification {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.8);
    border: 3px solid #72CB3B;
    border-radius: 10px;
    padding: 20px;
    z-index: 1000;
    text-align: center;
    animation: fadeInOut 3s forwards;
    max-width: 80%;
}

.biomeDestroyedNotification h3 {
    color: #FFC107;
    margin: 0 0 10px 0;
    font-size: 1.8rem;
}

.biomeDestroyedNotification p {
    margin: 0;
    font-size: 1.2rem;
}
"""
    
    # Append the CSS to the file
    with open(css_path, "a") as f:
        f.write(biome_notification_css)
    
    print("Added biome destroyed notification CSS")


def main():
    """Main function to parse arguments and execute appropriate functionality"""
    parser = argparse.ArgumentParser(description="Biome utility functions")
    parser.add_argument("--setup", action="store_true", help="Set up the environment")
    parser.add_argument("--create-notification", action="store_true", help="Create biome destroyed notification CSS")
    
    args = parser.parse_args()
    
    if args.setup:
        setup_environment()
        
    if args.create_notification:
        create_biome_destroyed_notification()
        
    if not (args.setup or args.create_notification):
        parser.print_help()


if __name__ == "__main__":
    main() 