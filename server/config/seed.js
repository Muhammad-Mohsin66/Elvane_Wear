import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Announcement from '../models/Announcement.js';

dotenv.config();

const products = [
  // 1. The Heritage 3-Stripes Retro Set (2 Colors: Emerald Deep Teal, Washed Olive Sage)
  {
    title: 'The Heritage 3-Stripes Retro Tracksuit',
    slug: 'heritage-3-stripes-retro-tracksuit',
    description: 'An archival sportswear icon engineered with luxury atelier proportions. Designed with structured raglan sleeves, contrast heritage striping along the arms and tapered jogger silhouette, and finished with antique brushed hardware.',
    price: 21500,
    category: 'Essential Set',
    fabric: '70% Cotton Double-Knit, 30% Recycled Poly Pique | 380 GSM',
    care: 'Machine wash cold inside out. Hang dry in shade. Low iron if needed.',
    images: ['https://res.cloudinary.com/up56alno/image/upload/v1793333563/elvena_wear/products/1-model.jpg', 'https://res.cloudinary.com/up56alno/image/upload/v1793333562/elvena_wear/products/1-flat.jpg'],
    colors: [
      {
        name: 'Forest Deep Teal',
        hex: '#374F4F',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333563/elvena_wear/products/1-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333562/elvena_wear/products/1-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333563/elvena_wear/products/1-model.jpg',
      },
      {
        name: 'Washed Olive Sage',
        hex: '#827F5E',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333566/elvena_wear/products/1.1-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333564/elvena_wear/products/1.1-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333566/elvena_wear/products/1.1-model.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true },
      { name: 'M', active: true },
      { name: 'L', active: true },
      { name: 'XL', active: true },
    ],
    inventoryCount: 45,
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
  },

  // 2. The Minimalist Duo-Tone Studio Set (2 Colors: Obsidian Duo-Tone, Carbon Asphalt)
  {
    title: 'The Minimalist Duo-Tone Studio Tracksuit',
    slug: 'minimalist-duo-tone-studio-tracksuit',
    description: 'Contemporary two-tone tailoring featuring a structured cream top paired with tapered obsidian joggers. Minimalist tonal embroidery, concealed zipped pockets, and heavy-drape ribbing along hems.',
    price: 22500,
    category: 'Heavyweight Set',
    fabric: '80% Luxury Pima Cotton, 20% Technical Poly | 400 GSM',
    care: 'Hand wash cold or gentle cycle. Lay flat to dry.',
    images: ['https://res.cloudinary.com/up56alno/image/upload/v1793333568/elvena_wear/products/2-model.jpg', 'https://res.cloudinary.com/up56alno/image/upload/v1793333567/elvena_wear/products/2-flat.jpg'],
    colors: [
      {
        name: 'Obsidian & Cream Duo',
        hex: '#181818',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333568/elvena_wear/products/2-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333567/elvena_wear/products/2-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333568/elvena_wear/products/2-model.jpg',
      },
      {
        name: 'Carbon Asphalt Duo',
        hex: '#2B2D2F',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333571/elvena_wear/products/2.1-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333569/elvena_wear/products/2.1-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333571/elvena_wear/products/2.1-model.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true },
      { name: 'M', active: true },
      { name: 'L', active: true },
      { name: 'XL', active: true },
      { name: 'XXL', active: true },
    ],
    inventoryCount: 38,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
  },

  // 3. The Atelier Monogram 4-Season Quad Set (4 Colors: Charcoal Slate, Terracotta Rust, Stone Grey, Desert Taupe)
  {
    title: 'The Atelier Monogram Quad-Color Tracksuit',
    slug: 'atelier-monogram-quad-color-tracksuit',
    description: 'A masterpiece in chromatic variety. Crafted from our proprietary ultra-soft brushed fleece, offering high thermal regulation and sleek dropped-shoulder posture with tonal luxury aglets.',
    price: 23800,
    category: 'Essential Set',
    fabric: '100% Organic Pima Cotton Brushed Fleece | 390 GSM',
    care: 'Cold wash gentle cycle. Do not bleach. Lay flat to dry.',
    images: ['https://res.cloudinary.com/up56alno/image/upload/v1793333573/elvena_wear/products/3-model.jpg', 'https://res.cloudinary.com/up56alno/image/upload/v1793333572/elvena_wear/products/3-flat.jpg'],
    colors: [
      {
        name: 'Charcoal Slate',
        hex: '#3C3B37',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333573/elvena_wear/products/3-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333572/elvena_wear/products/3-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333573/elvena_wear/products/3-model.jpg',
      },
      {
        name: 'Terracotta Rust',
        hex: '#85462C',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333575/elvena_wear/products/3.1-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333574/elvena_wear/products/3.1-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333575/elvena_wear/products/3.1-model.jpg',
      },
      {
        name: 'Stone Heather Grey',
        hex: '#68696E',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333577/elvena_wear/products/3.2-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333576/elvena_wear/products/3.2-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333577/elvena_wear/products/3.2-model.jpg',
      },
      {
        name: 'Desert Earth Taupe',
        hex: '#695B4F',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333579/elvena_wear/products/3.3-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333578/elvena_wear/products/3.3-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333579/elvena_wear/products/3.3-model.jpg',
      },
    ],
    sizes: [
      { name: 'XS', active: true },
      { name: 'S', active: true },
      { name: 'M', active: true },
      { name: 'L', active: true },
      { name: 'XL', active: true },
    ],
    inventoryCount: 60,
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
  },

  // 4. The Engineered Performance Two-Tone Set (2 Colors: Desert Khaki, Mineral Deep Teal)
  {
    title: 'The Engineered Performance Tracksuit',
    slug: 'engineered-performance-tracksuit',
    description: 'Precision engineered for movement and transition. Features ergonomic darting along elbows and knees, invisible stash pockets, and breathable interior lining for active luxury lifestyles.',
    price: 22000,
    category: 'Heavyweight Set',
    fabric: '85% Technical Cotton Blend, 15% Stretch Elastane | 360 GSM',
    care: 'Machine wash cold delicate. Tumble dry ultra-low.',
    images: ['https://res.cloudinary.com/up56alno/image/upload/v1793333581/elvena_wear/products/4-model.jpg', 'https://res.cloudinary.com/up56alno/image/upload/v1793333580/elvena_wear/products/4-flat.jpg'],
    colors: [
      {
        name: 'Desert Khaki Olive',
        hex: '#524D39',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333581/elvena_wear/products/4-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333580/elvena_wear/products/4-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333581/elvena_wear/products/4-model.jpg',
      },
      {
        name: 'Mineral Deep Teal',
        hex: '#263737',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333583/elvena_wear/products/4.1-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333582/elvena_wear/products/4.1-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333583/elvena_wear/products/4.1-model.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true },
      { name: 'M', active: true },
      { name: 'L', active: true },
      { name: 'XL', active: true },
    ],
    inventoryCount: 40,
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
  },

  // 5. The French Terry Relaxed Heavyweight Set (2 Colors: Midnight Pitch Black, Ivory Chalk Grey)
  {
    title: 'The French Terry Heavyweight Set',
    slug: 'french-terry-heavyweight-set',
    description: 'Substantial 420 GSM French Terry looped fabric that drapes with architectural presence. The relaxed boxy hoodie matches seamlessly with straight-leg relaxed trousers with concealed hems.',
    price: 24500,
    category: 'Heavyweight Set',
    fabric: '100% Unbrushed Loopback French Terry Cotton | 420 GSM',
    care: 'Cold water wash inside out. Do not tumble dry. Steam gently.',
    images: ['https://res.cloudinary.com/up56alno/image/upload/v1793333585/elvena_wear/products/5-model.jpg', 'https://res.cloudinary.com/up56alno/image/upload/v1793333584/elvena_wear/products/5-flat.jpg'],
    colors: [
      {
        name: 'Midnight Pitch Black',
        hex: '#1E1E1E',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333585/elvena_wear/products/5-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333584/elvena_wear/products/5-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333585/elvena_wear/products/5-model.jpg',
      },
      {
        name: 'Ivory Chalk Grey',
        hex: '#CECAC7',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333587/elvena_wear/products/5.1-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333586/elvena_wear/products/5.1-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333587/elvena_wear/products/5.1-model.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true },
      { name: 'M', active: true },
      { name: 'L', active: true },
      { name: 'XL', active: true },
      { name: 'XXL', active: true },
    ],
    inventoryCount: 52,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
  },

  // 6. The Tailored Zip-Pocket Street Tracksuit (2 Colors: Camel Beige Contrast, Off-White Slate)
  {
    title: 'The Tailored Zip-Pocket Street Tracksuit',
    slug: 'tailored-zip-pocket-street-tracksuit',
    description: 'Clean urban elegance. Designed with two-tone contrasting color-blocking, custom rubber-coated zippers, and deep trouser pockets tailored specifically for smartphones and everyday essentials.',
    price: 19800,
    category: 'Essential Set',
    fabric: '75% Pima Cotton, 25% High-Tensile Poly | 350 GSM',
    care: 'Machine wash cold with similar colors. Hang dry.',
    images: ['https://res.cloudinary.com/up56alno/image/upload/v1793333589/elvena_wear/products/6-model.jpg', 'https://res.cloudinary.com/up56alno/image/upload/v1793333588/elvena_wear/products/6-flat.jpg'],
    colors: [
      {
        name: 'Camel Beige & Black',
        hex: '#C2AC97',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333589/elvena_wear/products/6-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333588/elvena_wear/products/6-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333589/elvena_wear/products/6-model.jpg',
      },
      {
        name: 'Off-White & Charcoal Slate',
        hex: '#CFCECA',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333591/elvena_wear/products/6.1-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333590/elvena_wear/products/6.1-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333591/elvena_wear/products/6.1-model.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true },
      { name: 'M', active: true },
      { name: 'L', active: true },
      { name: 'XL', active: true },
    ],
    inventoryCount: 35,
    isFeatured: false,
    isNewArrival: false,
    isBestseller: false,
  },

  // 7. The Cashmere-Touch Tri-Tone Ensemble (3 Colors: Soft Taupe, Platinum Pearl, Obsidian Shadow)
  {
    title: 'The Cashmere-Touch Tri-Tone Ensemble',
    slug: 'cashmere-touch-tri-tone-ensemble',
    description: 'Impossibly soft against the skin, engineered with micro-brushed yarns that emulate pure cashmere. Ultra-lightweight warmth, clean flat seams, and delicate minimalist branding.',
    price: 25500,
    category: 'Cashmere Set',
    fabric: '70% Long-Staple Cotton, 25% Silk-Touch Modal, 5% Cashmere | 380 GSM',
    care: 'Dry clean recommended or ultra-gentle hand wash. Lay flat.',
    images: ['https://res.cloudinary.com/up56alno/image/upload/v1793333593/elvena_wear/products/7-model.jpg', 'https://res.cloudinary.com/up56alno/image/upload/v1793333592/elvena_wear/products/7-flat.jpg'],
    colors: [
      {
        name: 'Warm Taupe Sand',
        hex: '#7A7167',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333593/elvena_wear/products/7-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333592/elvena_wear/products/7-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333593/elvena_wear/products/7-model.jpg',
      },
      {
        name: 'Platinum Pearl White',
        hex: '#D3CAC1',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333595/elvena_wear/products/7.1-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333594/elvena_wear/products/7.1-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333595/elvena_wear/products/7.1-model.jpg',
      },
      {
        name: 'Obsidian Shadow',
        hex: '#262626',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333597/elvena_wear/products/7.2-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333596/elvena_wear/products/7.2-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333597/elvena_wear/products/7.2-model.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true },
      { name: 'M', active: true },
      { name: 'L', active: true },
      { name: 'XL', active: true },
    ],
    inventoryCount: 42,
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
  },

  // 8. The Signature Velour Gold-Edition Tracksuit (3 Colors: Mocha Espresso, Champagne Almond, Noir Gold)
  {
    title: 'The Signature Velour Gold-Edition Tracksuit',
    slug: 'signature-velour-gold-edition-tracksuit',
    description: 'The definitive luxury lounge statement. Deep plush velour pile with high dimensional sheen, custom champagne-gold zip sliders, and a tailored tapered trouser with clean ankle finish.',
    price: 26000,
    category: 'Velour Set',
    fabric: '80% Premium Plush Velour Cotton, 20% Technical Silk Poly | 410 GSM',
    care: 'Dry clean or inside-out cold gentle wash. Do not iron directly on velour.',
    images: ['https://res.cloudinary.com/up56alno/image/upload/v1793333600/elvena_wear/products/8-model.jpg', 'https://res.cloudinary.com/up56alno/image/upload/v1793333598/elvena_wear/products/8-flat.jpg'],
    colors: [
      {
        name: 'Mocha Espresso',
        hex: '#473E37',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333600/elvena_wear/products/8-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333598/elvena_wear/products/8-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333600/elvena_wear/products/8-model.jpg',
      },
      {
        name: 'Champagne Almond',
        hex: '#C5AF98',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333601/elvena_wear/products/8.1-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333600/elvena_wear/products/8.1-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333601/elvena_wear/products/8.1-model.jpg',
      },
      {
        name: 'Noir Velvet Black',
        hex: '#202020',
        active: true,
        modelImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333603/elvena_wear/products/8.2-model.jpg',
        articleImage: 'https://res.cloudinary.com/up56alno/image/upload/v1793333602/elvena_wear/products/8.2-flat.jpg',
        imageUrl: 'https://res.cloudinary.com/up56alno/image/upload/v1793333603/elvena_wear/products/8.2-model.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true },
      { name: 'M', active: true },
      { name: 'L', active: true },
      { name: 'XL', active: true },
    ],
    inventoryCount: 30,
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MONGO_URI is missing from environment variables.');
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');

    // 1. Seed Users (Superadmin & Admin) if not existing
    const existingSuper = await User.findOne({ email: process.env.SUPERADMIN_EMAIL || 'superadmin@elvanewear.com' });
    if (!existingSuper) {
      await User.create({
        fullName: 'Executive Super Admin',
        email: process.env.SUPERADMIN_EMAIL || 'superadmin@elvanewear.com',
        password: process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@123',
        role: 'superadmin',
        isEmailVerified: true,
      });
      console.log('👑 Super Admin seeded: superadmin@elvanewear.com');
    }

    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@elvanewear.com' });
    if (!existingAdmin) {
      await User.create({
        fullName: 'Store Operations Admin',
        email: process.env.ADMIN_EMAIL || 'admin@elvanewear.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        role: 'admin',
        isEmailVerified: true,
      });
      console.log('🛡️  Admin seeded: admin@elvanewear.com');
    }

    // 2. Clear old demo products and insert real photoshoot products
    await Product.deleteMany({});
    console.log('🗑️  Cleared old dummy products');

    await Product.insertMany(products);
    console.log(`✨ Successfully seeded ${products.length} luxury tracksuit sets with all photoshoot images!`);

    // 3. Ensure default announcement
    const annCount = await Announcement.countDocuments();
    if (annCount === 0) {
      await Announcement.create({
        text: 'SEASONAL PRIVILEGE — 15% OFF APPLIED ON FINAL BILL',
        discountPercent: 15,
        isActive: true,
      });
      console.log('📢 Default announcement created');
    }

    console.log('\n🏛️  All Atelier data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
