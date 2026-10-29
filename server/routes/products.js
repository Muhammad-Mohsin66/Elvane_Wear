import express from 'express';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createAuditLog } from '../utils/auditLog.js';
import { uploadFileToCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, sort, search, featured } = req.query;
    let filter = {};
    if (category && category !== 'All Sets') filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (featured === 'true') filter.isFeatured = true;

    let query = Product.find(filter);
    if (sort === 'price-asc') query = query.sort({ price: 1 });
    else if (sort === 'price-desc') query = query.sort({ price: -1 });
    else if (sort === 'newest') query = query.sort({ createdAt: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query;
    // Strip inventoryCount for non-admin requests
    const publicProducts = products.map(p => {
      const obj = p.toObject();
      delete obj.inventoryCount;
      // Only return active colors and sizes
      obj.colors = obj.colors.filter(c => c.active);
      obj.sizes = obj.sizes.filter(s => s.active);
      return obj;
    });
    res.json(publicProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.find({ slug: req.params.slug });
    if (!product.length) return res.status(404).json({ message: 'Product not found' });
    const obj = product[0].toObject();
    delete obj.inventoryCount;
    obj.colors = obj.colors.filter(c => c.active);
    obj.sizes = obj.sizes.filter(s => s.active);
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const obj = product.toObject();
    delete obj.inventoryCount;
    obj.colors = obj.colors.filter(c => c.active);
    obj.sizes = obj.sizes.filter(s => s.active);
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all products with full details
router.get('/admin/all', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Upload single image for color variant
router.post('/upload-image', protect, authorize('admin', 'superadmin'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }
    let url = `/uploads/${req.file.filename}`;
    try {
      const cloudUrl = await uploadFileToCloudinary(req.file.path, 'elvena_wear/products');
      if (cloudUrl) url = cloudUrl;
    } catch (err) {
      console.warn('Cloudinary upload fallback to local storage:', err.message);
    }
    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create product
router.post('/', protect, authorize('admin', 'superadmin'), upload.array('images', 6), async (req, res) => {
  try {
    const { title, slug, description, price, category, fabric, care, colors, sizes, inventoryCount, isFeatured, isNewArrival, isBestseller } = req.body;
    let images = [];
    if (req.files && req.files.length > 0) {
      for (const f of req.files) {
        try {
          const cloudUrl = await uploadFileToCloudinary(f.path, 'elvena_wear/products');
          images.push(cloudUrl || `/uploads/${f.filename}`);
        } catch {
          images.push(`/uploads/${f.filename}`);
        }
      }
    }
    
    const parsedColors = JSON.parse(colors || '[]').map(c => ({
      name: c.name,
      hex: c.hex,
      active: c.active !== false,
      modelImage: c.modelImage || c.imageUrl || '',
      articleImage: c.articleImage || c.imageUrl || c.modelImage || '',
      imageUrl: c.imageUrl || c.modelImage || c.articleImage || '',
    }));

    const product = await Product.create({
      title, slug, description,
      price: Number(price),
      category, fabric, care,
      images,
      colors: parsedColors,
      sizes: JSON.parse(sizes || '[]'),
      inventoryCount: Number(inventoryCount) || 0,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,
      isBestseller: isBestseller === 'true' || isBestseller === true,
    });

    await createAuditLog({
      admin: req.user,
      actionType: 'PRODUCT_ADDED',
      targetType: 'Product',
      targetId: product._id,
      targetName: product.title,
      after: { title, price, category },
      description: `Added new product: ${title}`
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update product
router.put('/:id', protect, authorize('admin', 'superadmin'), upload.array('images', 6), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const before = { title: product.title, price: product.price, inventoryCount: product.inventoryCount };
    const { title, description, price, category, fabric, care, colors, sizes, inventoryCount, isFeatured, isNewArrival, isBestseller } = req.body;

    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (category) product.category = category;
    if (fabric !== undefined) product.fabric = fabric;
    if (care !== undefined) product.care = care;
    if (sizes) product.sizes = JSON.parse(sizes);
    if (colors) {
      const parsed = JSON.parse(colors);
      product.colors = parsed.map(c => ({
        name: c.name,
        hex: c.hex,
        active: c.active !== false,
        modelImage: c.modelImage || c.imageUrl || '',
        articleImage: c.articleImage || c.imageUrl || c.modelImage || '',
        imageUrl: c.imageUrl || c.modelImage || c.articleImage || '',
      }));
    }
    if (inventoryCount !== undefined) product.inventoryCount = Number(inventoryCount);
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (isNewArrival !== undefined) product.isNewArrival = isNewArrival === 'true' || isNewArrival === true;
    if (isBestseller !== undefined) product.isBestseller = isBestseller === 'true' || isBestseller === true;
    if (req.files && req.files.length > 0) {
      const uploadedCloudImages = [];
      for (const f of req.files) {
        try {
          const cloudUrl = await uploadFileToCloudinary(f.path, 'elvena_wear/products');
          uploadedCloudImages.push(cloudUrl || `/uploads/${f.filename}`);
        } catch {
          uploadedCloudImages.push(`/uploads/${f.filename}`);
        }
      }
      product.images = [...product.images, ...uploadedCloudImages];
    }

    await product.save();

    const actionType = inventoryCount !== undefined && Number(inventoryCount) !== before.inventoryCount ? 'INVENTORY_UPDATED' : 'PRODUCT_UPDATED';
    await createAuditLog({
      admin: req.user,
      actionType,
      targetType: 'Product',
      targetId: product._id,
      targetName: product.title,
      before,
      after: { title: product.title, price: product.price, inventoryCount: product.inventoryCount },
      description: `Updated product: ${product.title}`
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete product
router.delete('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    await createAuditLog({
      admin: req.user,
      actionType: 'PRODUCT_DELETED',
      targetType: 'Product',
      targetId: product._id,
      targetName: product.title,
      before: { title: product.title, price: product.price },
      description: `Deleted product: ${product.title}`
    });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ message: 'You have already reviewed this product' });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    product.calculateAverageRating();
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
