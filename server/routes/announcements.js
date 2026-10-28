import express from 'express';
import Announcement from '../models/Announcement.js';
import { protect, authorize } from '../middleware/auth.js';
import { createAuditLog } from '../utils/auditLog.js';

const router = express.Router();

// Get active announcement (public)
router.get('/active', async (req, res) => {
  try {
    const announcement = await Announcement.findOne({ isActive: true }).sort({ updatedAt: -1 });
    res.json(announcement || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all announcements
router.get('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ updatedAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create or update announcement
router.post('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { text, isActive, discountPercent } = req.body;
    
    // Deactivate all existing
    await Announcement.updateMany({}, { isActive: false });
    
    const announcement = await Announcement.create({
      text,
      isActive: isActive !== false,
      discountPercent: Number(discountPercent) || 0,
    });

    await createAuditLog({
      admin: req.user,
      actionType: 'ANNOUNCEMENT_UPDATED',
      targetType: 'Announcement',
      targetId: announcement._id,
      targetName: text.substring(0, 50),
      after: { text, isActive: announcement.isActive, discountPercent },
      description: `Updated announcement: "${text.substring(0, 50)}..."`
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Toggle announcement
router.put('/:id/toggle', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Not found' });
    
    if (!announcement.isActive) {
      await Announcement.updateMany({}, { isActive: false });
    }
    announcement.isActive = !announcement.isActive;
    await announcement.save();
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
