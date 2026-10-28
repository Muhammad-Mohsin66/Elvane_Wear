import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Announcement from '../models/Announcement.js';

dotenv.config();

const products = [
  {
    title: 'The Beckenbauer 3-Stripes Heritage Tracksuit',
    slug: 'beckenbauer-3-stripes-heritage',
    description: 'The pinnacle of adidas archival sportswear reimagined in high-fashion atelier luxury. Featuring iconic 3-stripes along sleeves and tapered legs, tailored ribbed collar, and double-knit structure.',
    price: 21500,
    category: 'Essential Set',
    fabric: '70% Cotton, 30% Recycled Polyester Pique | 360 GSM',
    care: 'Machine wash cold delicate. Hang to dry. Low iron.',
    images: ['/images/products/p1-cream-model.jpg', '/images/products/p1-cream-flat.jpg'],
    colors: [
      {
        name: 'Cream Beige',
        hex: '#EDE8DF',
        active: true,
        modelImage: '/images/products/p1-cream-model.jpg',
        articleImage: '/images/products/p1-cream-flat.jpg',
      },
      {
        name: 'Matte Black',
        hex: '#1F1F1F',
        active: true,
        modelImage: '/images/products/p1-black-model.jpg',
        articleImage: '/images/products/p1-black-flat.jpg',
      },
      {
        name: 'Vintage Burgundy',
        hex: '#6B2737',
        active: true,
        modelImage: '/images/products/p1-burgundy-model.jpg',
        articleImage: '/images/products/p1-burgundy-flat.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true }, { name: 'XL', active: true },
    ],
    inventoryCount: 45,
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
  },
  {
    title: 'The Tiro 24 Pro Performance Tracksuit',
    slug: 'tiro-24-pro-performance',
    description: 'Engineered for fluid movement and precision tailoring. Sleek stand collar, articulated raglan sleeves, ankle zips, and Aeroready performance blend with a matte luxury finish.',
    price: 22000,
    category: 'Heavyweight Set',
    fabric: '85% Doubleknit Performance Cotton, 15% Elastane | 340 GSM',
    care: 'Machine wash cold with like colors. Tumble dry low.',
    images: ['/images/products/p2-black-model.jpg', '/images/products/p2-black-flat.jpg'],
    colors: [
      {
        name: 'Matte Black',
        hex: '#1C1C1E',
        active: true,
        modelImage: '/images/products/p2-black-model.jpg',
        articleImage: '/images/products/p2-black-flat.jpg',
      },
      {
        name: 'Collegiate Navy',
        hex: '#1B263B',
        active: true,
        modelImage: '/images/products/p2-navy-model.jpg',
        articleImage: '/images/products/p2-navy-flat.jpg',
      },
      {
        name: 'Carbon Slate',
        hex: '#3A3D40',
        active: true,
        modelImage: '/images/products/p2-carbon-model.jpg',
        articleImage: '/images/products/p2-carbon-flat.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true }, { name: 'XL', active: true }, { name: 'XXL', active: true },
    ],
    inventoryCount: 50,
    isFeatured: true,
    isBestseller: true,
  },
  {
    title: 'The SST Primeblue Heritage Tracksuit',
    slug: 'sst-primeblue-heritage',
    description: 'Classic baseball-collar tracksuit crafted with high-density tricot interlock. Ribbed hem and cuffs, clean contrasting white 3-stripes, and sleek front zip pockets.',
    price: 20500,
    category: 'Essential Set',
    fabric: '60% Recycled Polyester, 40% Cotton Tricot | 310 GSM',
    care: 'Machine wash warm inside out. Hang dry. Do not iron print.',
    images: ['/images/products/p3-navy-model.jpg', '/images/products/p3-navy-flat.jpg'],
    colors: [
      {
        name: 'Collegiate Navy',
        hex: '#1D2D44',
        active: true,
        modelImage: '/images/products/p3-navy-model.jpg',
        articleImage: '/images/products/p3-navy-flat.jpg',
      },
      {
        name: 'Emerald Green',
        hex: '#1E3F20',
        active: true,
        modelImage: '/images/products/p3-green-model.jpg',
        articleImage: '/images/products/p3-green-flat.jpg',
      },
      {
        name: 'Chalk White',
        hex: '#F0EFEA',
        active: true,
        modelImage: '/images/products/p3-chalk-model.jpg',
        articleImage: '/images/products/p3-chalk-flat.jpg',
      },
    ],
    sizes: [
      { name: 'XS', active: true }, { name: 'S', active: true },
      { name: 'M', active: true }, { name: 'L', active: true }, { name: 'XL', active: true },
    ],
    inventoryCount: 38,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
  },
  {
    title: 'The Firebird Velour Gold-Edition Tracksuit',
    slug: 'firebird-velour-gold-edition',
    description: 'Sumptuous heavyweight plush cotton velour elevated with champagne gold hardware and tonal embroidered crest. Unrivaled softness and radiant drape.',
    price: 24500,
    category: 'Velour Set',
    fabric: '80% Premium Cotton, 20% Polyester Velour | 380 GSM',
    care: 'Dry clean or cold wash inside out. Lay flat to dry.',
    images: ['/images/products/p4-green-model.jpg', '/images/products/p4-green-flat.jpg'],
    colors: [
      {
        name: 'Forest Emerald',
        hex: '#1C3D2B',
        active: true,
        modelImage: '/images/products/p4-green-model.jpg',
        articleImage: '/images/products/p4-green-flat.jpg',
      },
      {
        name: 'Sand Dune Gold',
        hex: '#C8A26A',
        active: true,
        modelImage: '/images/products/p4-sand-model.jpg',
        articleImage: '/images/products/p4-sand-flat.jpg',
      },
      {
        name: 'Midnight Noir',
        hex: '#161616',
        active: true,
        modelImage: '/images/products/p4-noir-model.jpg',
        articleImage: '/images/products/p4-noir-flat.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true }, { name: 'XL', active: true },
    ],
    inventoryCount: 32,
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
  },
  {
    title: 'The Z.N.E. French Terry Heavyweight Set',
    slug: 'zne-french-terry-heavyweight',
    description: 'Designed for total focus and thermal sanctuary. Thick structured hood, noise-dampening heavyweight French terry, and clean hidden seam architecture.',
    price: 23000,
    category: 'Heavyweight Set',
    fabric: '100% Organic Heavy French Terry | 420 GSM',
    care: 'Machine wash cold delicate. Tumble dry low.',
    images: ['/images/products/p5-charcoal-model.jpg', '/images/products/p5-charcoal-flat.jpg'],
    colors: [
      {
        name: 'Charcoal Heather',
        hex: '#3E424B',
        active: true,
        modelImage: '/images/products/p5-charcoal-model.jpg',
        articleImage: '/images/products/p5-charcoal-flat.jpg',
      },
      {
        name: 'Pure Obsidian',
        hex: '#1A1A24',
        active: true,
        modelImage: '/images/products/p5-obsidian-model.jpg',
        articleImage: '/images/products/p5-obsidian-flat.jpg',
      },
      {
        name: 'Cloud Light Grey',
        hex: '#B0B4BA',
        active: true,
        modelImage: '/images/products/p5-grey-model.jpg',
        articleImage: '/images/products/p5-grey-flat.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true }, { name: 'XL', active: true }, { name: 'XXL', active: true },
    ],
    inventoryCount: 60,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: 'The Sahara Sand Dune Velour Tracksuit',
    slug: 'sahara-sand-dune-velour',
    description: 'Warm desert golden hues meet velvet softness. Minimalist stand collar, custom gold puller, and matching tailored joggers with deep side pockets.',
    price: 22500,
    category: 'Velour Set',
    fabric: '85% Cotton, 15% Modal Velour | 360 GSM',
    care: 'Machine wash cold inside out. Do not bleach. Air dry.',
    images: ['/images/products/p6-tan-model.jpg', '/images/products/p6-tan-flat.jpg'],
    colors: [
      {
        name: 'Camel Tan',
        hex: '#BFA27E',
        active: true,
        modelImage: '/images/products/p6-tan-model.jpg',
        articleImage: '/images/products/p6-tan-flat.jpg',
      },
      {
        name: 'Chocolate Mocha',
        hex: '#5C3D2E',
        active: true,
        modelImage: '/images/products/p6-mocha-model.jpg',
        articleImage: '/images/products/p6-mocha-flat.jpg',
      },
      {
        name: 'Desert Cream',
        hex: '#EBE1D0',
        active: true,
        modelImage: '/images/products/p6-cream-model.jpg',
        articleImage: '/images/products/p6-cream-flat.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true }, { name: 'XL', active: true },
    ],
    inventoryCount: 40,
    isFeatured: true,
    isBestseller: true,
  },
  {
    title: 'The Terrex All-Weather Utility Cargo Set',
    slug: 'terrex-all-weather-cargo',
    description: 'Rugged outdoor engineering meets luxury tailoring. Reinforced arm cargo utility pocket, articulated knee gussets, and water-repellent tech weave.',
    price: 25000,
    category: 'Heavyweight Set',
    fabric: '90% Tech Ripstop Cotton, 10% Nylon DWR | 380 GSM',
    care: 'Machine wash cold gentle. Do not use fabric softener. Air dry.',
    images: ['/images/products/p7-olive-model.jpg', '/images/products/p7-olive-flat.jpg'],
    colors: [
      {
        name: 'Deep Olive',
        hex: '#475236',
        active: true,
        modelImage: '/images/products/p7-olive-model.jpg',
        articleImage: '/images/products/p7-olive-flat.jpg',
      },
      {
        name: 'Stealth Black',
        hex: '#1E1E1E',
        active: true,
        modelImage: '/images/products/p7-black-model.jpg',
        articleImage: '/images/products/p7-black-flat.jpg',
      },
      {
        name: 'Coyote Tan',
        hex: '#A38B6D',
        active: true,
        modelImage: '/images/products/p7-tan-model.jpg',
        articleImage: '/images/products/p7-tan-flat.jpg',
      },
    ],
    sizes: [
      { name: 'M', active: true }, { name: 'L', active: true },
      { name: 'XL', active: true }, { name: 'XXL', active: true },
    ],
    inventoryCount: 35,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: 'The Club Originals Retro Tricot Set',
    slug: 'club-originals-retro-tricot',
    description: 'Vintage European club heritage. Polished interlock knit in deep burgundy and ink navy with retro piping along the chest and raglan shoulders.',
    price: 19500,
    category: 'Essential Set',
    fabric: '70% Cotton, 30% Polyester Doubleknit | 310 GSM',
    care: 'Machine wash warm inside out. Tumble dry delicate.',
    images: ['/images/products/p8-burgundy-model.jpg', '/images/products/p8-burgundy-flat.jpg'],
    colors: [
      {
        name: 'Vintage Burgundy',
        hex: '#68202F',
        active: true,
        modelImage: '/images/products/p8-burgundy-model.jpg',
        articleImage: '/images/products/p8-burgundy-flat.jpg',
      },
      {
        name: 'Legend Ink Navy',
        hex: '#1D283C',
        active: true,
        modelImage: '/images/products/p8-navy-model.jpg',
        articleImage: '/images/products/p8-navy-flat.jpg',
      },
      {
        name: 'Forest Pine',
        hex: '#274735',
        active: true,
        modelImage: '/images/products/p8-pine-model.jpg',
        articleImage: '/images/products/p8-pine-flat.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true }, { name: 'XL', active: true },
    ],
    inventoryCount: 48,
    isFeatured: true,
  },
  {
    title: 'The Future Icons 3-Bar Minimalist Set',
    slug: 'future-icons-3-bar-minimalist',
    description: 'Clean Scandinavian-inspired minimalism. Drop-shoulder silhouette, matte textured French terry, and clean tonal three-bar silicone detailing.',
    price: 18500,
    category: 'Essential Set',
    fabric: '95% Pima Cotton, 5% Elastane | 340 GSM',
    care: 'Machine wash cold inside-out. Hang to dry.',
    images: ['/images/products/p9-grey-model.jpg', '/images/products/p9-grey-flat.jpg'],
    colors: [
      {
        name: 'Steel Cloud Grey',
        hex: '#8E939B',
        active: true,
        modelImage: '/images/products/p9-grey-model.jpg',
        articleImage: '/images/products/p9-grey-flat.jpg',
      },
      {
        name: 'Matte Onyx',
        hex: '#222222',
        active: true,
        modelImage: '/images/products/p9-onyx-model.jpg',
        articleImage: '/images/products/p9-onyx-flat.jpg',
      },
      {
        name: 'Chalk Pearl',
        hex: '#ECEAE4',
        active: true,
        modelImage: '/images/products/p9-pearl-model.jpg',
        articleImage: '/images/products/p9-pearl-flat.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true }, { name: 'XL', active: true },
    ],
    inventoryCount: 52,
    isFeatured: true,
    isNewArrival: false,
  },
  {
    title: 'The Adicolor Heritage Double-Knit Set',
    slug: 'adicolor-heritage-double-knit',
    description: 'The epitome of quiet luxury knitwear. Crafted from extra-fine Italian merino and cashmere-cotton yarns with a buttery hand-feel and weighted drape.',
    price: 26000,
    category: 'Cashmere Set',
    fabric: '70% Supima Cotton, 30% Cashmere | 400 GSM',
    care: 'Dry clean recommended. Hand wash cold flat dry.',
    images: ['/images/products/p10-mocha-model.jpg', '/images/products/p10-mocha-flat.jpg'],
    colors: [
      {
        name: 'Dark Mocha Brown',
        hex: '#4E3B31',
        active: true,
        modelImage: '/images/products/p10-mocha-model.jpg',
        articleImage: '/images/products/p10-mocha-flat.jpg',
      },
      {
        name: 'Cashmere Oatmeal',
        hex: '#D9CFC4',
        active: true,
        modelImage: '/images/products/p10-oatmeal-model.jpg',
        articleImage: '/images/products/p10-oatmeal-flat.jpg',
      },
      {
        name: 'Deep Charcoal',
        hex: '#2C2D30',
        active: true,
        modelImage: '/images/products/p10-charcoal-model.jpg',
        articleImage: '/images/products/p10-charcoal-flat.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true }, { name: 'XL', active: true },
    ],
    inventoryCount: 28,
    isFeatured: true,
    isBestseller: true,
  },
  {
    title: 'The Primegreen Hybrid Warmup Set',
    slug: 'primegreen-hybrid-warmup',
    description: 'Athletic precision for modern movement. High-stretch aeroknit fabric, tapered calf ergonomics, and concealed waterproof zips.',
    price: 19000,
    category: 'Essential Set',
    fabric: '88% Recycled Polyester, 12% Spandex Aeroknit | 290 GSM',
    care: 'Machine wash cold delicate. Hang to dry.',
    images: ['/images/products/p11-blue-model.jpg', '/images/products/p11-blue-flat.jpg'],
    colors: [
      {
        name: 'Royal Cobalt Blue',
        hex: '#1E40AF',
        active: true,
        modelImage: '/images/products/p11-blue-model.jpg',
        articleImage: '/images/products/p11-blue-flat.jpg',
      },
      {
        name: 'Matte Obsidian',
        hex: '#18191E',
        active: true,
        modelImage: '/images/products/p11-black-model.jpg',
        articleImage: '/images/products/p11-black-flat.jpg',
      },
      {
        name: 'Frost White',
        hex: '#F3F4F6',
        active: true,
        modelImage: '/images/products/p11-white-model.jpg',
        articleImage: '/images/products/p11-white-flat.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true }, { name: 'XL', active: true }, { name: 'XXL', active: true },
    ],
    inventoryCount: 44,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: 'The Atelier Monogram Limited Edition Set',
    slug: 'atelier-monogram-limited',
    description: 'Collector edition limited to 200 bespoke sets worldwide. Subtle jacquard monogram weave, gold-plated dual-way zippers, and numbered leather atelier patch.',
    price: 28500,
    category: 'Limited Edition',
    fabric: '100% Long-Staple Egyptian Cotton Jacquard | 410 GSM',
    care: 'Dry clean only. Store on wooden hanger with dust bag.',
    images: ['/images/products/p12-obsidian-model.jpg', '/images/products/p12-obsidian-flat.jpg'],
    colors: [
      {
        name: 'Obsidian & Gold',
        hex: '#18181A',
        active: true,
        modelImage: '/images/products/p12-obsidian-model.jpg',
        articleImage: '/images/products/p12-obsidian-flat.jpg',
      },
      {
        name: 'Champagne Gold',
        hex: '#C8A870',
        active: true,
        modelImage: '/images/products/p12-champagne-model.jpg',
        articleImage: '/images/products/p12-champagne-flat.jpg',
      },
      {
        name: 'Silver Mist',
        hex: '#D5D8DC',
        active: true,
        modelImage: '/images/products/p12-silver-model.jpg',
        articleImage: '/images/products/p12-silver-flat.jpg',
      },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true },
    ],
    inventoryCount: 20,
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Announcement.deleteMany({});

    // Create Super Admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: process.env.SUPERADMIN_EMAIL || 'superadmin@elvanewear.com',
      password: process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@123',
      role: 'superadmin',
      isEmailVerified: true,
    });
    console.log(`✅ Super Admin created: ${superAdmin.email}`);

    // Create Admin
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@elvanewear.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
      isEmailVerified: true,
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // Create all 12 products
    await Product.insertMany(products);
    console.log(`✅ ${products.length} luxury tracksuit sets seeded successfully!`);

    // Create default announcement
    await Announcement.create({
      text: 'SEASONAL PRIVILEGE — 15% OFF APPLIED ON FINAL BILL',
      isActive: true,
      discountPercent: 15,
    });
    console.log('✅ Default announcement created');

    console.log('\n🎉 Database seeded successfully with 12 complete sets!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
