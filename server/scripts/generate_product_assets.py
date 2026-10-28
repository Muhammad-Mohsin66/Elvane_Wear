#!/usr/bin/env python3
import os
import sys
from PIL import Image, ImageEnhance, ImageOps

PRODUCT_DIR = "/Users/m.mohsin/Desktop/untitled folder/client/public/images/products"

def adjust_color(img, hue_shift=0, sat_mult=1.0, val_mult=1.0, tint_color=None, tint_strength=0.0):
    """Adjust color of an image cleanly maintaining contrast and realism."""
    # Convert to RGB
    img = img.convert('RGB')
    
    if tint_color and tint_strength > 0:
        # Create solid tint layer
        tint_layer = Image.new('RGB', img.size, tint_color)
        # Blend with original
        img = Image.blend(img, tint_layer, tint_strength)
    
    if sat_mult != 1.0:
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(sat_mult)
        
    if val_mult != 1.0:
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(val_mult)
        
    # Re-apply subtle contrast
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.05)
    
    return img

def main():
    os.makedirs(PRODUCT_DIR, exist_ok=True)
    
    # 1. Product 7 Olive Flat (from green flat with olive tint)
    p4_flat = Image.open(os.path.join(PRODUCT_DIR, "p4-green-flat.jpg"))
    p7_olive_flat = adjust_color(p4_flat, tint_color=(75, 85, 55), tint_strength=0.28, sat_mult=0.8, val_mult=0.92)
    p7_olive_flat.save(os.path.join(PRODUCT_DIR, "p7-olive-flat.jpg"), quality=95)
    print("Created p7-olive-flat.jpg")
    
    # Base images mappings for 12 products
    # We will generate model & flat images for each product's primary and alternate colors
    
    # Product 1: Cream, Black, Burgundy
    p1_model_base = Image.open(os.path.join(PRODUCT_DIR, "p1-cream-model.jpg"))
    p1_flat_base = Image.open(os.path.join(PRODUCT_DIR, "p1-cream-flat.jpg"))
    # P1 Black
    p2_model_base = Image.open(os.path.join(PRODUCT_DIR, "p2-black-model.jpg"))
    p2_flat_base = Image.open(os.path.join(PRODUCT_DIR, "p2-black-flat.jpg"))
    p2_model_base.save(os.path.join(PRODUCT_DIR, "p1-black-model.jpg"), quality=95)
    p2_flat_base.save(os.path.join(PRODUCT_DIR, "p1-black-flat.jpg"), quality=95)
    # P1 Burgundy
    p1_burgundy_model = adjust_color(p1_model_base, tint_color=(105, 30, 48), tint_strength=0.25, sat_mult=1.3, val_mult=0.88)
    p1_burgundy_flat = adjust_color(p1_flat_base, tint_color=(105, 30, 48), tint_strength=0.35, sat_mult=1.4, val_mult=0.82)
    p1_burgundy_model.save(os.path.join(PRODUCT_DIR, "p1-burgundy-model.jpg"), quality=95)
    p1_burgundy_flat.save(os.path.join(PRODUCT_DIR, "p1-burgundy-flat.jpg"), quality=95)
    
    # Product 2: Black, Navy, Carbon
    p3_model_base = Image.open(os.path.join(PRODUCT_DIR, "p3-navy-model.jpg"))
    p3_flat_base = Image.open(os.path.join(PRODUCT_DIR, "p3-navy-flat.jpg"))
    p3_model_base.save(os.path.join(PRODUCT_DIR, "p2-navy-model.jpg"), quality=95)
    p3_flat_base.save(os.path.join(PRODUCT_DIR, "p2-navy-flat.jpg"), quality=95)
    # P2 Carbon
    p5_model_base = Image.open(os.path.join(PRODUCT_DIR, "p5-charcoal-model.jpg"))
    p5_flat_base = Image.open(os.path.join(PRODUCT_DIR, "p5-charcoal-flat.jpg"))
    p5_model_base.save(os.path.join(PRODUCT_DIR, "p2-carbon-model.jpg"), quality=95)
    p5_flat_base.save(os.path.join(PRODUCT_DIR, "p2-carbon-flat.jpg"), quality=95)
    
    # Product 3: Navy, Green, Chalk White
    p4_model_base = Image.open(os.path.join(PRODUCT_DIR, "p4-green-model.jpg"))
    p4_model_base.save(os.path.join(PRODUCT_DIR, "p3-green-model.jpg"), quality=95)
    p4_flat.save(os.path.join(PRODUCT_DIR, "p3-green-flat.jpg"), quality=95)
    p1_model_base.save(os.path.join(PRODUCT_DIR, "p3-chalk-model.jpg"), quality=95)
    p1_flat_base.save(os.path.join(PRODUCT_DIR, "p3-chalk-flat.jpg"), quality=95)
    
    # Product 4: Emerald Green, Sand Gold, Midnight Noir
    p6_model_base = Image.open(os.path.join(PRODUCT_DIR, "p6-tan-model.jpg"))
    p6_flat_base = Image.open(os.path.join(PRODUCT_DIR, "p6-tan-flat.jpg"))
    p6_model_base.save(os.path.join(PRODUCT_DIR, "p4-sand-model.jpg"), quality=95)
    p6_flat_base.save(os.path.join(PRODUCT_DIR, "p4-sand-flat.jpg"), quality=95)
    p2_model_base.save(os.path.join(PRODUCT_DIR, "p4-noir-model.jpg"), quality=95)
    p2_flat_base.save(os.path.join(PRODUCT_DIR, "p4-noir-flat.jpg"), quality=95)
    
    # Product 5: Charcoal, Obsidian, Light Grey
    p2_model_base.save(os.path.join(PRODUCT_DIR, "p5-obsidian-model.jpg"), quality=95)
    p2_flat_base.save(os.path.join(PRODUCT_DIR, "p5-obsidian-flat.jpg"), quality=95)
    p5_grey_model = adjust_color(p5_model_base, val_mult=1.3, sat_mult=0.7)
    p5_grey_flat = adjust_color(p5_flat_base, val_mult=1.35, sat_mult=0.6)
    p5_grey_model.save(os.path.join(PRODUCT_DIR, "p5-grey-model.jpg"), quality=95)
    p5_grey_flat.save(os.path.join(PRODUCT_DIR, "p5-grey-flat.jpg"), quality=95)
    
    # Product 6: Sand Camel, Mocha, Cream
    p6_mocha_model = adjust_color(p6_model_base, tint_color=(80, 50, 35), tint_strength=0.25, sat_mult=1.1, val_mult=0.85)
    p6_mocha_flat = adjust_color(p6_flat_base, tint_color=(80, 50, 35), tint_strength=0.3, sat_mult=1.1, val_mult=0.85)
    p6_mocha_model.save(os.path.join(PRODUCT_DIR, "p6-mocha-model.jpg"), quality=95)
    p6_mocha_flat.save(os.path.join(PRODUCT_DIR, "p6-mocha-flat.jpg"), quality=95)
    p1_model_base.save(os.path.join(PRODUCT_DIR, "p6-cream-model.jpg"), quality=95)
    p1_flat_base.save(os.path.join(PRODUCT_DIR, "p6-cream-flat.jpg"), quality=95)
    
    # Product 7: Olive, Black, Tan
    p7_model_base = Image.open(os.path.join(PRODUCT_DIR, "p7-olive-model.jpg"))
    p2_model_base.save(os.path.join(PRODUCT_DIR, "p7-black-model.jpg"), quality=95)
    p2_flat_base.save(os.path.join(PRODUCT_DIR, "p7-black-flat.jpg"), quality=95)
    p6_model_base.save(os.path.join(PRODUCT_DIR, "p7-tan-model.jpg"), quality=95)
    p6_flat_base.save(os.path.join(PRODUCT_DIR, "p7-tan-flat.jpg"), quality=95)
    
    # Product 8: Club Originals Retro (Burgundy, Navy, Forest Pine)
    p8_burgundy_model = adjust_color(p3_model_base, tint_color=(120, 20, 45), tint_strength=0.4, sat_mult=1.3)
    p8_burgundy_flat = adjust_color(p3_flat_base, tint_color=(120, 20, 45), tint_strength=0.45, sat_mult=1.3)
    p8_burgundy_model.save(os.path.join(PRODUCT_DIR, "p8-burgundy-model.jpg"), quality=95)
    p8_burgundy_flat.save(os.path.join(PRODUCT_DIR, "p8-burgundy-flat.jpg"), quality=95)
    p3_model_base.save(os.path.join(PRODUCT_DIR, "p8-navy-model.jpg"), quality=95)
    p3_flat_base.save(os.path.join(PRODUCT_DIR, "p8-navy-flat.jpg"), quality=95)
    p4_model_base.save(os.path.join(PRODUCT_DIR, "p8-pine-model.jpg"), quality=95)
    p4_flat.save(os.path.join(PRODUCT_DIR, "p8-pine-flat.jpg"), quality=95)
    
    # Product 9: Future Icons 3-Bar (Steel Cloud Grey, Onyx, Pearl)
    p9_grey_model = adjust_color(p2_model_base, val_mult=1.5, sat_mult=0.4)
    p9_grey_flat = adjust_color(p2_flat_base, val_mult=1.6, sat_mult=0.3)
    p9_grey_model.save(os.path.join(PRODUCT_DIR, "p9-grey-model.jpg"), quality=95)
    p9_grey_flat.save(os.path.join(PRODUCT_DIR, "p9-grey-flat.jpg"), quality=95)
    p2_model_base.save(os.path.join(PRODUCT_DIR, "p9-onyx-model.jpg"), quality=95)
    p2_flat_base.save(os.path.join(PRODUCT_DIR, "p9-onyx-flat.jpg"), quality=95)
    p1_model_base.save(os.path.join(PRODUCT_DIR, "p9-pearl-model.jpg"), quality=95)
    p1_flat_base.save(os.path.join(PRODUCT_DIR, "p9-pearl-flat.jpg"), quality=95)
    
    # Product 10: Adicolor Heritage Double-Knit (Mocha Brown, Oatmeal, Charcoal)
    p10_mocha_model = adjust_color(p1_model_base, tint_color=(75, 45, 30), tint_strength=0.38, sat_mult=1.1, val_mult=0.8)
    p10_mocha_flat = adjust_color(p1_flat_base, tint_color=(75, 45, 30), tint_strength=0.45, sat_mult=1.1, val_mult=0.78)
    p10_mocha_model.save(os.path.join(PRODUCT_DIR, "p10-mocha-model.jpg"), quality=95)
    p10_mocha_flat.save(os.path.join(PRODUCT_DIR, "p10-mocha-flat.jpg"), quality=95)
    p1_model_base.save(os.path.join(PRODUCT_DIR, "p10-oatmeal-model.jpg"), quality=95)
    p1_flat_base.save(os.path.join(PRODUCT_DIR, "p10-oatmeal-flat.jpg"), quality=95)
    p5_model_base.save(os.path.join(PRODUCT_DIR, "p10-charcoal-model.jpg"), quality=95)
    p5_flat_base.save(os.path.join(PRODUCT_DIR, "p10-charcoal-flat.jpg"), quality=95)
    
    # Product 11: Primegreen Hybrid (Royal Blue, Matte Black, Frost White)
    p11_blue_model = adjust_color(p3_model_base, tint_color=(25, 60, 180), tint_strength=0.35, sat_mult=1.4)
    p11_blue_flat = adjust_color(p3_flat_base, tint_color=(25, 60, 180), tint_strength=0.4, sat_mult=1.4)
    p11_blue_model.save(os.path.join(PRODUCT_DIR, "p11-blue-model.jpg"), quality=95)
    p11_blue_flat.save(os.path.join(PRODUCT_DIR, "p11-blue-flat.jpg"), quality=95)
    p2_model_base.save(os.path.join(PRODUCT_DIR, "p11-black-model.jpg"), quality=95)
    p2_flat_base.save(os.path.join(PRODUCT_DIR, "p11-black-flat.jpg"), quality=95)
    p1_model_base.save(os.path.join(PRODUCT_DIR, "p11-white-model.jpg"), quality=95)
    p1_flat_base.save(os.path.join(PRODUCT_DIR, "p11-white-flat.jpg"), quality=95)
    
    # Product 12: Atelier Monogram Limited (Obsidian & Gold, Champagne, Silver)
    p2_model_base.save(os.path.join(PRODUCT_DIR, "p12-obsidian-model.jpg"), quality=95)
    p2_flat_base.save(os.path.join(PRODUCT_DIR, "p12-obsidian-flat.jpg"), quality=95)
    p6_model_base.save(os.path.join(PRODUCT_DIR, "p12-champagne-model.jpg"), quality=95)
    p6_flat_base.save(os.path.join(PRODUCT_DIR, "p12-champagne-flat.jpg"), quality=95)
    p5_grey_model.save(os.path.join(PRODUCT_DIR, "p12-silver-model.jpg"), quality=95)
    p5_grey_flat.save(os.path.join(PRODUCT_DIR, "p12-silver-flat.jpg"), quality=95)

    print("Successfully generated all product assets!")

if __name__ == '__main__':
    main()
