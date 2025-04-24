#!/usr/bin/env python3
"""
Generate pixel art unlock biome icon for biome unlocking button
"""
from PIL import Image
import os

def create_unlock_biome_icon(size=24, output_path="../public/assets/unlock_biome.png"):
    """Create a simple pixel art unlock biome icon"""
    # Create a transparent image
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    pixels = img.load()
    
    # Define colors
    grass_color = (76, 175, 80, 255)    # Green for grass
    grass_dark = (56, 142, 60, 255)     # Dark green for shading
    soil_color = (121, 85, 72, 255)     # Brown for soil
    soil_dark = (93, 64, 55, 255)       # Dark brown for soil shading
    key_color = (255, 215, 0, 255)      # Gold color for key
    key_dark = (212, 175, 55, 255)      # Dark gold for key shading
    
    # Draw biome base (rectangle with top grass and bottom soil)
    for x in range(4, 20):
        for y in range(8, 18):
            # Top grass part
            if y < 12:
                pixels[x, y] = grass_color
                # Add shading
                if y == 11 or x == 4:
                    pixels[x, y] = grass_dark
            # Bottom soil part
            else:
                pixels[x, y] = soil_color
                # Add shading
                if y == 17 or x == 4:
                    pixels[x, y] = soil_dark
    
    # Draw a simple key shape over the biome to represent unlocking
    # Key head
    for x in range(14, 19):
        for y in range(5, 10):
            if (x == 14 or x == 18 or y == 5 or y == 9):
                pixels[x, y] = key_dark
            else:
                pixels[x, y] = key_color
    
    # Key tooth
    pixels[17, 7] = (0, 0, 0, 0)  # Make transparent
    
    # Key stem
    for y in range(10, 15):
        pixels[16, y] = key_color
        # Shading
        if y == 14:
            pixels[16, y] = key_dark
    
    # Key bit
    for x in range(12, 16):
        pixels[x, 14] = key_color
        # Shading
        if x == 12:
            pixels[x, 14] = key_dark
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save the image
    img.save(output_path)
    print(f"Unlock biome icon saved to {output_path}")

if __name__ == "__main__":
    create_unlock_biome_icon() 