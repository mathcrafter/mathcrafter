import os
from PIL import Image, ImageDraw

# Ensure output directory exists
os.makedirs('assets', exist_ok=True)

def create_pickaxe():
    # Create a wooden pickaxe image (32x32 pixels)
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Handle (brown)
    draw.rectangle([(12, 16), (19, 25)], fill=(139, 69, 19))
    
    # Pickaxe head (gray)
    draw.rectangle([(5, 5), (14, 12)], fill=(169, 169, 169))
    draw.rectangle([(20, 5), (29, 12)], fill=(169, 169, 169))
    
    img.save('assets/pickaxe.png')
    
    # Stone pickaxe
    img_stone = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw_stone = ImageDraw.Draw(img_stone)
    
    # Handle (brown)
    draw_stone.rectangle([(12, 16), (19, 25)], fill=(139, 69, 19))
    
    # Pickaxe head (darker gray)
    draw_stone.rectangle([(5, 5), (14, 12)], fill=(105, 105, 105))
    draw_stone.rectangle([(20, 5), (29, 12)], fill=(105, 105, 105))
    
    img_stone.save('assets/stone-pickaxe.png')
    
    # Iron pickaxe
    img_iron = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw_iron = ImageDraw.Draw(img_iron)
    
    # Handle (brown)
    draw_iron.rectangle([(12, 16), (19, 25)], fill=(139, 69, 19))
    
    # Pickaxe head (light blue-gray for iron)
    draw_iron.rectangle([(5, 5), (14, 12)], fill=(176, 196, 222))
    draw_iron.rectangle([(20, 5), (29, 12)], fill=(176, 196, 222))
    
    img_iron.save('assets/iron-pickaxe.png')

def create_gemstone():
    # Create a gemstone image (24x24 pixels)
    img = Image.new('RGBA', (24, 24), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Diamond shape (blue)
    diamond_color = (65, 105, 225)  # Royal blue
    
    # Draw diamond shape
    draw.polygon([(12, 2), (22, 12), (12, 22), (2, 12)], fill=diamond_color)
    
    # Add sparkle
    draw.point([(8, 8), (16, 8), (12, 6), (12, 18)], fill=(255, 255, 255))
    
    img.save('assets/gemstone.png')

def create_crack():
    # Create a crack image (24x24 pixels)
    img = Image.new('RGBA', (24, 24), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw crack lines (black)
    draw.line([(12, 6), (12, 18)], fill=(0, 0, 0), width=2)
    draw.line([(6, 12), (18, 12)], fill=(0, 0, 0), width=2)
    draw.line([(8, 8), (16, 16)], fill=(0, 0, 0), width=2)
    draw.line([(16, 8), (8, 16)], fill=(0, 0, 0), width=2)
    
    img.save('assets/crack.png')

def create_biome_textures():
    # Create a plain biome texture (64x64 pixels)
    plain = Image.new('RGBA', (64, 64), (100, 150, 100))  # Green base
    draw_plain = ImageDraw.Draw(plain)
    
    # Add some texture (darker green patches)
    for i in range(10):
        x = i * 6
        y = (i * 7) % 60
        draw_plain.rectangle([(x, y), (x+4, y+4)], fill=(80, 120, 80))
    
    plain.save('assets/plain-biome.png')
    
    # Create a desert biome texture (64x64 pixels)
    desert = Image.new('RGBA', (64, 64), (210, 180, 140))  # Sandy color
    draw_desert = ImageDraw.Draw(desert)
    
    # Add some texture (lighter sand patches)
    for i in range(10):
        x = i * 6
        y = (i * 7) % 60
        draw_desert.rectangle([(x, y), (x+4, y+4)], fill=(230, 210, 170))
    
    desert.save('assets/desert-biome.png')
    
    # Create a desert biome icon (32x32)
    desert_icon = Image.new('RGBA', (32, 32), (210, 180, 140))
    draw_desert_icon = ImageDraw.Draw(desert_icon)
    
    # Add cactus
    draw_desert_icon.rectangle([(13, 8), (17, 24)], fill=(50, 120, 50))
    draw_desert_icon.rectangle([(8, 12), (22, 16)], fill=(50, 120, 50))
    
    desert_icon.save('assets/desert-biome-icon.png')

# Create all assets
create_pickaxe()
create_gemstone()
create_crack()
create_biome_textures()

print("Pixel art assets created successfully!") 