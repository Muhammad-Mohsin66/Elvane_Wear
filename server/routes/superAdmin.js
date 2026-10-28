import express from 'express';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import Order from '../models/Order.js';
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

// Super Admin: Get admin user info
router.get('/admin-user', protect, authorize('superadmin'), async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Super Admin: Change admin password
router.put('/admin-password', protect, authorize('superadmin'), async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin user not found' });

    admin.password = newPassword;
    await admin.save();

    await createAuditLog({
      admin: req.user,
      actionType: 'ADMIN_PASSWORD_CHANGED',
      targetType: 'Admin',
      targetId: admin._id,
      targetName: admin.name,
      description: `Super Admin changed Admin password`
    });

    res.json({ message: 'Admin password updated successfully' });
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
    const codOrders = validOrders.filter(o => o.paymentMethod === 'COD').length;
    const jazzCashOrders = validOrders.filter(o => o.paymentMethod === 'JazzCash').length;

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
    const statusDist = {};
    orders.forEach(o => {
      statusDist[o.orderStatus] = (statusDist[o.orderStatus] || 0) + 1;
    });

    const totalCustomers = await User.countDocuments({ role: 'customer' });

    res.json({
      totalRevenue, totalOrders, avgOrderValue, totalCustomers,
      codOrders, jazzCashOrders,
      revenueChart: Object.values(chartData).sort((a, b) => a.date.localeCompare(b.date)),
      topProducts: Object.values(productMap).sort((a, b) => b.sold - a.sold).slice(0, 5),
      statusDistribution: statusDist,
      paymentSplit: { COD: codOrders, JazzCash: jazzCashOrders },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
