import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, authorize, requireVerifiedEmail } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createAuditLog } from '../utils/auditLog.js';

const router = express.Router();

// Create order (customer, must be verified)
router.post('/', protect, requireVerifiedEmail, upload.single('jazzCashScreenshot'), async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    const parsedItems = JSON.parse(items);
    
    if (!parsedItems || parsedItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    let subtotal = 0;
    const orderItems = [];
    for (const item of parsedItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
      if (product.inventoryCount < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
      }
      orderItems.push({
        product: product._id,
        title: product.title,
        image: product.images[0] || '',
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: product.price,
      });
      subtotal += product.price * item.quantity;
      product.inventoryCount -= item.quantity;
      await product.save();
    }

    const parsedAddress = JSON.parse(shippingAddress);
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: parsedAddress,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      subtotal,
      total: subtotal,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my orders (customer)
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && !['admin', 'superadmin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all orders
router.get('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.orderStatus = status;
    const orders = await Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update order status
router.put('/:id/status', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const before = { orderStatus: order.orderStatus };
    order.orderStatus = req.body.orderStatus;
    if (req.body.adminNotes) order.adminNotes = req.body.adminNotes;
    await order.save();

    await createAuditLog({
      admin: req.user,
      actionType: 'ORDER_STATUS_UPDATED',
      targetType: 'Order',
      targetId: order._id,
      targetName: order.orderNumber,
      before,
      after: { orderStatus: order.orderStatus },
      description: `Order ${order.orderNumber} status: ${before.orderStatus} → ${order.orderStatus}`
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Verify JazzCash payment
router.put('/:id/verify-payment', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const before = { paymentStatus: order.paymentStatus };
    order.paymentStatus = req.body.paymentStatus; // 'Verified' or 'Rejected'
    await order.save();

    await createAuditLog({
      admin: req.user,
      actionType: req.body.paymentStatus === 'Verified' ? 'PAYMENT_VERIFIED' : 'PAYMENT_REJECTED',
      targetType: 'Order',
      targetId: order._id,
      targetName: order.orderNumber,
      before,
      after: { paymentStatus: order.paymentStatus },
      description: `JazzCash payment ${req.body.paymentStatus.toLowerCase()} for ${order.orderNumber}`
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Apply discount to order
router.put('/:id/discount', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const before = { discountPercent: order.discountPercent, discountAmount: order.discountAmount, total: order.total };
    const { discountPercent, discountAmount } = req.body;
    
    if (discountPercent) {
      order.discountPercent = Number(discountPercent);
      order.discountAmount = Math.round(order.subtotal * (Number(discountPercent) / 100));
    } else if (discountAmount) {
      order.discountAmount = Number(discountAmount);
      order.discountPercent = Math.round((Number(discountAmount) / order.subtotal) * 100);
    }
    order.total = order.subtotal - order.discountAmount;
    await order.save();

    await createAuditLog({
      admin: req.user,
      actionType: 'DISCOUNT_APPLIED',
      targetType: 'Order',
      targetId: order._id,
      targetName: order.orderNumber,
      before,
      after: { discountPercent: order.discountPercent, discountAmount: order.discountAmount, total: order.total },
      description: `Applied ${order.discountPercent}% discount (Rs. ${order.discountAmount}) to ${order.orderNumber}`
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Revenue stats
router.get('/stats/revenue', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { period } = req.query; // daily, weekly, monthly
    const now = new Date();
    let startDate;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        break;
      case 'weekly':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
    }

    const orders = await Order.find({
      createdAt: { $gte: startDate },
      orderStatus: { $nin: ['Cancelled'] }
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = orders.length;
    const codOrders = orders.filter(o => o.paymentMethod === 'COD').length;
    const jazzCashOrders = orders.filter(o => o.paymentMethod === 'JazzCash').length;
    const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;

    // Group by date
    const revenueByDate = {};
    orders.forEach(o => {
      let key;
      if (period === 'monthly') {
        key = `${o.createdAt.getFullYear()}-${String(o.createdAt.getMonth() + 1).padStart(2, '0')}`;
      } else if (period === 'weekly') {
        const weekStart = new Date(o.createdAt);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = o.createdAt.toISOString().split('T')[0];
      }
      if (!revenueByDate[key]) revenueByDate[key] = { date: key, revenue: 0, orders: 0 };
      revenueByDate[key].revenue += o.total;
      revenueByDate[key].orders += 1;
    });

    // Top selling products
    const productSales = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        const id = item.product.toString();
        if (!productSales[id]) productSales[id] = { title: item.title, totalSold: 0, totalRevenue: 0 };
        productSales[id].totalSold += item.quantity;
        productSales[id].totalRevenue += item.price * item.quantity;
      });
    });
    const topProducts = Object.values(productSales).sort((a, b) => b.totalSold - a.totalSold).slice(0, 5);

    res.json({
      totalRevenue, totalOrders, codOrders, jazzCashOrders, deliveredOrders, pendingOrders,
      revenueChart: Object.values(revenueByDate).sort((a, b) => a.date.localeCompare(b.date)),
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
