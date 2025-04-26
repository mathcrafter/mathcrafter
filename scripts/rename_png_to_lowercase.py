#!/usr/bin/env python3
"""
Script to rename all PNG files in ~/Downloads/ to lowercase.
"""
import os
import pathlib
from pathlib import Path

def rename_png_to_lowercase():
    """Rename all PNG files in ~/Downloads/ to lowercase."""
    downloads_dir = Path.home() / "Downloads"
    
    if not downloads_dir.exists():
        print(f"Error: Downloads directory '{downloads_dir}' not found.")
        return
    
    count = 0
    for file in downloads_dir.glob("*.png"):
        lowercase_name = file.name.lower()
        if file.name != lowercase_name:
            lowercase_path = file.parent / lowercase_name
            if lowercase_path.exists():
                print(f"Warning: '{lowercase_path}' already exists. Skipping '{file.name}'.")
                continue
            
            file.rename(lowercase_path)
            count += 1
    
    print(f"Renamed {count} PNG files to lowercase.")

if __name__ == "__main__":
    rename_png_to_lowercase() 