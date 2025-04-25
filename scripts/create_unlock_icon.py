#!/usr/bin/env python3
"""
Generate a pixel art icon for biome unlocking
"""
from PIL import Image
import os

def create_unlock_icon(size=32, output_path="../public/assets/unlock_icon.png"):
    """Create a pixel art unlock icon"""
    # Create a transparent image
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    pixels = img.load()
    
    # Define colors
    gold_color = (255, 215, 0, 255)      # Main gold color
    gold_dark = (212, 175, 55, 255)      # Darker gold for shading
    gold_highlight = (255, 235, 100, 255)  # Lighter gold for highlights
    
    # Draw a key shape
    # Key head (circle with square cutout)
    for x in range(8, 24):
        for y in range(8, 24):
            # Calculate distance from center for circle
            dx = x - 16
            dy = y - 16
            distance = (dx * dx + dy * dy) ** 0.5
            
            # Create circular key head
            if distance <= 8:
                # Basic circle
                pixels[x, y] = gold_color
                
                # Add shading to bottom-right
                if dx > 0 and dy > 0:
                    pixels[x, y] = gold_dark
                
                # Add highlight to top-left
                if dx < 0 and dy < 0:
                    pixels[x, y] = gold_highlight
                
                # Create square cutout for key
                if 12 <= x <= 20 and 12 <= y <= 20:
                    pixels[x, y] = (0, 0, 0, 0)  # Make transparent
    
    # Key shaft
    for y in range(24, 28):
        for x in range(14, 18):
            pixels[x, y] = gold_color
            
            # Add shading
            if x == 17:
                pixels[x, y] = gold_dark
            
            # Add highlight
            if x == 14:
                pixels[x, y] = gold_highlight
    
    # Key teeth
    for x in range(10, 22):
        if 10 <= x <= 14 or 18 <= x <= 22:
            pixels[x, 26] = gold_color
            
            # Shading
            if 18 <= x <= 22:
                pixels[x, 27] = gold_dark
            
            # Highlight
            if 10 <= x <= 14:
                pixels[x, 25] = gold_highlight
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save the image
    img.save(output_path)
    print(f"Unlock icon saved to {output_path}")

if __name__ == "__main__":
    create_unlock_icon() 