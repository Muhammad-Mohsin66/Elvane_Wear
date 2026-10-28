import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Announcement from '../models/Announcement.js';

dotenv.config();

const products = [
  {
    title: 'The Atelier Cashmere-Blend Tracksuit',
    slug: 'atelier-cashmere-blend',
    description: 'Crafted from Italian cashmere-cotton blend, this tracksuit embodies quiet luxury. Relaxed silhouette with ribbed cuffs and hidden zip details.',
    price: 24000,
    category: 'Cashmere Set',
    fabric: '70% Cotton, 30% Cashmere | 380 GSM',
    care: 'Dry clean recommended. Hand wash cold. Lay flat to dry.',
    images: ['/seed/tracksuit-1.jpg'],
    colors: [
      { name: 'Cream', hex: '#F5F0E8', active: true },
      { name: 'Charcoal', hex: '#3A3A3A', active: true },
      { name: 'Camel', hex: '#C4A882', active: true },
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
    title: 'Glacier Merino Wool Set',
    slug: 'glacier-merino-set',
    description: 'Premium Australian merino wool with a buttery hand feel. Temperature-regulating, naturally odor-resistant. The pinnacle of active luxury.',
    price: 22500,
    category: 'Heavyweight Set',
    fabric: '100% Extra-Fine Merino Wool | 340 GSM',
    care: 'Wool cycle wash. Do not tumble dry. Shape while damp.',
    images: ['/seed/tracksuit-2.jpg'],
    colors: [
      { name: 'Sky Blue', hex: '#B8DCF0', active: true },
      { name: 'Ivory', hex: '#FFFFF0', active: true },
      { name: 'Slate', hex: '#708090', active: true },
    ],
    sizes: [
      { name: 'XS', active: true }, { name: 'S', active: true },
      { name: 'M', active: true }, { name: 'L', active: true },
      { name: 'XL', active: true },
    ],
    inventoryCount: 38,
    isFeatured: true,
    isBestseller: true,
  },
  {
    title: 'Obsidian Minimalist Set',
    slug: 'obsidian-minimalist-set',
    description: 'Stark, architectural lines in deep obsidian. Double-faced jersey construction with invisible seams and a structured yet flowing drape.',
    price: 18500,
    category: 'Essential Set',
    fabric: '95% Pima Cotton, 5% Elastane | 320 GSM',
    care: 'Machine wash cold. Hang dry. Iron on medium.',
    images: ['/seed/tracksuit-3.jpg'],
    colors: [
      { name: 'Obsidian', hex: '#1A1A2E', active: true },
      { name: 'Graphite', hex: '#2D2D2D', active: true },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true }, { name: 'XL', active: true },
      { name: 'XXL', active: true },
    ],
    inventoryCount: 60,
    isFeatured: true,
  },
  {
    title: 'Sand Dune Velour Set',
    slug: 'sand-dune-velour-set',
    description: 'Rich velour with a plush pile finish inspired by the shifting sands of the Sahara. Satin-lined side pockets and tonal logo debossing.',
    price: 19500,
    category: 'Velour Set',
    fabric: '80% Cotton, 20% Polyester Velour | 360 GSM',
    care: 'Machine wash cold inside-out. Tumble dry low. Do not iron.',
    images: ['/seed/tracksuit-4.jpg'],
    colors: [
      { name: 'Sand', hex: '#C2B280', active: true },
      { name: 'Mocha', hex: '#7B5B3A', active: true },
      { name: 'Rust', hex: '#B7410E', active: true },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true }, { name: 'XL', active: true },
    ],
    inventoryCount: 50,
    isFeatured: true,
    isNewArrival: true,
  },
  {
    title: 'Ivory Tailored Set',
    slug: 'ivory-tailored-set',
    description: 'Where tailoring meets athleisure. Structured blazer-cut top with matching tapered joggers. Italian ponte fabric ensures a refined drape.',
    price: 21000,
    category: 'Essential Set',
    fabric: '72% Viscose, 24% Nylon, 4% Elastane | 300 GSM',
    care: 'Dry clean only. Steam to refresh.',
    images: ['/seed/tracksuit-5.jpg'],
    colors: [
      { name: 'Ivory', hex: '#FFFFF0', active: true },
      { name: 'Black Pearl', hex: '#1C1C1C', active: true },
    ],
    sizes: [
      { name: 'XS', active: true }, { name: 'S', active: true },
      { name: 'M', active: true }, { name: 'L', active: true },
    ],
    inventoryCount: 35,
    isBestseller: true,
  },
  {
    title: 'The Nocturne French Terry Set',
    slug: 'nocturne-french-terry',
    description: 'Midnight-inspired French Terry with a soft garment wash. Oversized fit with dropped shoulders and raw-edge hem details.',
    price: 15500,
    category: 'Essential Set',
    fabric: '100% Organic Cotton French Terry | 340 GSM',
    care: 'Machine wash cold. Tumble dry low.',
    images: ['/seed/tracksuit-6.jpg'],
    colors: [
      { name: 'Midnight', hex: '#191970', active: true },
      { name: 'Fog', hex: '#B5B0A8', active: true },
      { name: 'Stone', hex: '#918E85', active: true },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true }, { name: 'XL', active: true },
      { name: 'XXL', active: true },
    ],
    inventoryCount: 70,
    isNewArrival: true,
  },
  {
    title: 'The Riviera Linen-Blend Set',
    slug: 'riviera-linen-blend',
    description: 'Coastal luxury meets urban sensibility. Breathable linen-cotton blend with mother-of-pearl button accents and relaxed Mediterranean proportions.',
    price: 17000,
    category: 'Essential Set',
    fabric: '55% Linen, 45% Cotton | 240 GSM',
    care: 'Machine wash cold. Hang dry. Iron while damp for best results.',
    images: ['/seed/tracksuit-7.jpg'],
    colors: [
      { name: 'White Linen', hex: '#FAF0E6', active: true },
      { name: 'Sage', hex: '#9CAF88', active: true },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true }, { name: 'XL', active: true },
    ],
    inventoryCount: 42,
  },
  {
    title: 'The Carbon Heavyweight Set',
    slug: 'carbon-heavyweight',
    description: 'Engineered for winter. Ultra-dense 420 GSM fleece with thermal lining, adjustable drawcords, and reinforced stress points. Warmth without compromise.',
    price: 20000,
    category: 'Heavyweight Set',
    fabric: '85% Cotton, 15% Polyester | 420 GSM',
    care: 'Machine wash warm. Tumble dry medium.',
    images: ['/seed/tracksuit-8.jpg'],
    colors: [
      { name: 'Carbon', hex: '#333333', active: true },
      { name: 'Olive', hex: '#556B2F', active: true },
      { name: 'Navy', hex: '#1B2A4A', active: true },
    ],
    sizes: [
      { name: 'M', active: true }, { name: 'L', active: true },
      { name: 'XL', active: true }, { name: 'XXL', active: true },
    ],
    inventoryCount: 55,
    isFeatured: true,
  },
  {
    title: 'The Champagne Lounge Set',
    slug: 'champagne-lounge-set',
    description: 'Our signature champagne-gold toned lounge set. Brushed back fleece with silk-feel interior and subtle metallic thread detailing.',
    price: 16500,
    category: 'Velour Set',
    fabric: '88% Cotton, 12% Modal | 310 GSM',
    care: 'Machine wash cold inside-out. Do not bleach. Lay flat to dry.',
    images: ['/seed/tracksuit-9.jpg'],
    colors: [
      { name: 'Champagne', hex: '#D4A76A', active: true },
      { name: 'Rose Gold', hex: '#B76E79', active: true },
      { name: 'Pearl', hex: '#EAE0C8', active: true },
    ],
    sizes: [
      { name: 'XS', active: true }, { name: 'S', active: true },
      { name: 'M', active: true }, { name: 'L', active: true },
      { name: 'XL', active: true },
    ],
    inventoryCount: 48,
    isNewArrival: true,
    isBestseller: true,
  },
  {
    title: 'The Archive Limited Edition Set',
    slug: 'archive-limited-edition',
    description: 'From our archive collection—only 200 pieces worldwide. Numbered edition with hand-stitched leather patch and premium gift packaging.',
    price: 12500,
    category: 'Limited Edition',
    fabric: '100% Supima Cotton | 350 GSM',
    care: 'Hand wash recommended. Lay flat to dry.',
    images: ['/seed/tracksuit-10.jpg'],
    colors: [
      { name: 'Archive White', hex: '#F8F8F2', active: true },
      { name: 'Archive Black', hex: '#222222', active: true },
    ],
    sizes: [
      { name: 'S', active: true }, { name: 'M', active: true },
      { name: 'L', active: true },
    ],
    inventoryCount: 25,
    isFeatured: true,
    isNewArrival: true,
  }
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
      email: process.env.SUPERADMIN_EMAIL || 'superadmin@tommytracksuits.com',
      password: process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@123',
      role: 'superadmin',
      isEmailVerified: true,
    });
    console.log(`✅ Super Admin created: ${superAdmin.email} / ${process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@123'}`);

    // Create Admin
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@tommytracksuits.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'admin',
      isEmailVerified: true,
    });
    console.log(`✅ Admin created: ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);

    // Create products
    await Product.insertMany(products);
    console.log(`✅ ${products.length} luxury tracksuit sets seeded`);

    // Create default announcement
    await Announcement.create({
      text: 'SEASONAL PRIVILEGE — 15% OFF APPLIED ON FINAL BILL',
      isActive: true,
      discountPercent: 15,
    });
    console.log('✅ Default announcement created');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║          TOMMY TRACKSUITS — CREDENTIALS          ║');
    console.log('╠══════════════════════════════════════════════════╣');
    console.log(`║  Super Admin: ${superAdmin.email}`);
    console.log(`║  Password:    ${process.env.SUPERADMIN_PASSWORD || 'SuperAdmin@123'}`);
    console.log('║──────────────────────────────────────────────────║');
    console.log(`║  Admin:       ${admin.email}`);
    console.log(`║  Password:    ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    console.log('╚══════════════════════════════════════════════════╝\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
