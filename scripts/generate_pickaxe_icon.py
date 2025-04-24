#!/usr/bin/env python3
"""
Generate pixel art pickaxe icon for shop button
"""
from PIL import Image
import os

def create_pickaxe_icon(size=24, output_path="../public/assets/shop_pickaxe.png"):
    """Create a simple pixel art pickaxe icon"""
    # Create a transparent image
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    pixels = img.load()
    
    # Define colors
    handle_color = (139, 69, 19, 255)     # Brown
    handle_dark = (101, 67, 33, 255)      # Dark brown
    metal_color = (192, 192, 192, 255)    # Silver
    metal_dark = (105, 105, 105, 255)     # Dark silver
    metal_shine = (220, 220, 220, 255)    # Light silver for shine
    
    # Draw pickaxe handle (diagonal line) - THICKER
    for i in range(7, 19):
        # Main handle
        pixels[i, i] = handle_color
        # Make handle thicker (add pixels on both sides)
        pixels[i, i+1] = handle_color
        pixels[i+1, i] = handle_color
        
        # Add shading
        if i > 7:
            pixels[i-1, i] = handle_dark
            pixels[i-1, i+1] = handle_dark

    # Draw pickaxe head (top part) - THICKER
    for y in range(3, 8):  # Increased height range
        for x in range(4, 15):  # Increased width range
            if y == 3 and (x > 6 and x < 12):
                pixels[x, y] = metal_shine
            elif y == 7 and (x == 4 or x == 14):
                pixels[x, y] = metal_dark
            else:
                pixels[x, y] = metal_color
    
    # Draw pickaxe head (left part) - THICKER
    for x in range(3, 8):  # Increased width range 
        for y in range(4, 15):  # Increased height range
            if x == 3 and (y > 6 and y < 12):
                pixels[x, y] = metal_shine
            elif x == 7 and (y == 4 or y == 14):
                pixels[x, y] = metal_dark
            else:
                pixels[x, y] = metal_color
    
    # Add some shine/detail points
    pixels[6, 6] = metal_shine
    pixels[7, 5] = metal_shine
    pixels[5, 7] = metal_shine
    pixels[6, 5] = metal_shine
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save the image
    img.save(output_path)
    print(f"Icon saved to {output_path}")

if __name__ == "__main__":
    create_pickaxe_icon() 