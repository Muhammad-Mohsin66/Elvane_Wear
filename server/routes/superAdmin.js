import express from 'express';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, authorize } from '../middleware/auth.js';
import { createAuditLog } from '../utils/auditLog.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Super Admin: Get audit logs
router.get('/audit-logs', protect, authorize('superadmin'), async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await AuditLog.countDocuments();
    res.json({ logs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Super Admin: Get all admin users list
router.get('/admins', protect, authorize('superadmin'), async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Super Admin: Create a new admin user
router.post('/admins', protect, authorize('superadmin'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const newAdmin = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'admin',
      isEmailVerified: true,
    });

    await createAuditLog({
      admin: req.user,
      actionType: 'ADMIN_CREATED',
      targetType: 'Admin',
      targetId: newAdmin._id,
      targetName: newAdmin.name,
      description: `Super Admin created new Store Admin: ${newAdmin.name} (${newAdmin.email})`
    });

    const sanitized = await User.findById(newAdmin._id).select('-password');
    res.status(201).json(sanitized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Super Admin: Get primary admin user info (legacy fallback)
router.get('/admin-user', protect, authorize('superadmin'), async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Super Admin: Change admin password (by admin id or default admin)
router.put('/admin-password', protect, authorize('superadmin'), async (req, res) => {
  try {
    const { newPassword, adminId } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const query = adminId ? { _id: adminId, role: 'admin' } : { role: 'admin' };
    const admin = await User.findOne(query);
    if (!admin) return res.status(404).json({ message: 'Admin user not found' });

    admin.password = newPassword;
    await admin.save();

    await createAuditLog({
      admin: req.user,
      actionType: 'ADMIN_PASSWORD_CHANGED',
      targetType: 'Admin',
      targetId: admin._id,
      targetName: admin.name,
      description: `Super Admin changed password for Admin: ${admin.name} (${admin.email})`
    });

    res.json({ message: `Password for ${admin.name} updated successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Super Admin: Get Customer Directory with lifetime spending
router.get('/customers', protect, authorize('superadmin'), async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    const orders = await Order.find();

    const customerData = customers.map((c) => {
      const userOrders = orders.filter((o) => o.user?.toString() === c._id.toString());
      const totalSpent = userOrders.filter(o => o.orderStatus !== 'Cancelled').reduce((sum, o) => sum + o.total, 0);
      return {
        _id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone || userOrders[0]?.shippingAddress?.phone || 'N/A',
        city: c.address?.city || userOrders[0]?.shippingAddress?.city || 'N/A',
        totalOrders: userOrders.length,
        totalSpent,
        isEmailVerified: c.isEmailVerified,
        createdAt: c.createdAt,
      };
    });

    res.json(customerData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Super Admin: Advanced analytics
router.get('/analytics', protect, authorize('superadmin'), async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        break;
      case 'weekly':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
        break;
      default:
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    }

    const orders = await Order.find({ createdAt: { $gte: startDate } });
    const validOrders = orders.filter(o => o.orderStatus !== 'Cancelled');
    
    const totalRevenue = validOrders.reduce((s, o) => s + o.total, 0);
    const totalOrders = validOrders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const codOrders = validOrders.length; // 100% Cash on Delivery platform

    // Revenue chart data
    const chartData = {};
    validOrders.forEach(o => {
      let key;
      if (period === 'monthly') key = `${o.createdAt.getFullYear()}-${String(o.createdAt.getMonth()+1).padStart(2,'0')}`;
      else if (period === 'weekly') {
        const ws = new Date(o.createdAt); ws.setDate(ws.getDate() - ws.getDay());
        key = ws.toISOString().split('T')[0];
      } else key = o.createdAt.toISOString().split('T')[0];
      if (!chartData[key]) chartData[key] = { date: key, revenue: 0, orders: 0 };
      chartData[key].revenue += o.total;
      chartData[key].orders += 1;
    });

    // Top products
    const productMap = {};
    validOrders.forEach(o => o.items.forEach(item => {
      const id = item.product.toString();
      if (!productMap[id]) productMap[id] = { title: item.title, sold: 0, revenue: 0 };
      productMap[id].sold += item.quantity;
      productMap[id].revenue += item.price * item.quantity;
    }));

    // Status distribution
    const statusDist = {
      Pending: 0,
      Confirmed: 0,
      Processing: 0,
      Dispatched: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach(o => {
      if (statusDist[o.orderStatus] !== undefined) {
        statusDist[o.orderStatus] += 1;
      } else {
        statusDist[o.orderStatus] = 1;
      }
    });

    const totalCustomers = await User.countDocuments({ role: 'customer' });

    res.json({
      totalRevenue, totalOrders, avgOrderValue, totalCustomers,
      codOrders,
      revenueChart: Object.values(chartData).sort((a, b) => a.date.localeCompare(b.date)),
      topProducts: Object.values(productMap).sort((a, b) => b.sold - a.sold).slice(0, 5),
      statusDistribution: statusDist,
      orderPipeline: [
        { name: 'Pending Review', value: statusDist.Pending, color: '#D4A76A' },
        { name: 'Confirmed', value: statusDist.Confirmed, color: '#3B82F6' },
        { name: 'Processing', value: statusDist.Processing, color: '#8B5CF6' },
        { name: 'Dispatched', value: statusDist.Dispatched, color: '#0EA5E9' },
        { name: 'Delivered', value: statusDist.Delivered, color: '#22C55E' },
      ].filter(item => item.value > 0),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
