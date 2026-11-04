import express from 'express';
import Inquiry from '../models/Inquiry.js';
import { protect, authorize } from '../middleware/auth.js';
import { sendInquiryEmailToAdmin, sendInquiryReceiptToCustomer } from '../utils/email.js';
import { createAuditLog } from '../utils/auditLog.js';

const router = express.Router();

/**
 * Public: Submit a new inquiry / contact message
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Name, email, subject, and message are required' });
    }

    const inquiry = await Inquiry.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      phone: phone ? phone.trim() : '',
      status: 'Pending',
    });

    console.log(`\n📬 NEW CUSTOMER INQUIRY received from ${inquiry.name} (${inquiry.email}): "${inquiry.subject}"`);

    // 1. Dispatch email to official inbox: elvane.wears@gmail.com
    sendInquiryEmailToAdmin(inquiry).catch((err) => {
      console.warn('⚠️ Admin inquiry email dispatch notification error:', err.message);
    });

    // 2. Dispatch receipt confirmation to customer
    sendInquiryReceiptToCustomer(inquiry).catch((err) => {
      console.warn('⚠️ Customer inquiry receipt notification error:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry received. Our support team will get in touch shortly.',
      inquiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Admin / Super Admin: Get all inquiries
 */
router.get('/', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Admin / Super Admin: Update inquiry status (Pending / In Review / Resolved)
 */
router.patch('/:id/status', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    const prevStatus = inquiry.status;
    if (status) inquiry.status = status;
    if (adminNotes !== undefined) inquiry.adminNotes = adminNotes;
    await inquiry.save();

    await createAuditLog({
      admin: req.user,
      actionType: 'INQUIRY_STATUS_UPDATED',
      targetType: 'Inquiry',
      targetId: inquiry._id,
      targetName: `${inquiry.name} (${inquiry.subject})`,
      before: { status: prevStatus },
      after: { status: inquiry.status },
      description: `Inquiry "${inquiry.subject}" from ${inquiry.name} marked as ${inquiry.status}`
    });

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Admin / Super Admin: Delete inquiry
 */
router.delete('/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    await createAuditLog({
      admin: req.user,
      actionType: 'INQUIRY_DELETED',
      targetType: 'Inquiry',
      targetId: inquiry._id,
      targetName: `${inquiry.name} (${inquiry.subject})`,
      description: `Inquiry "${inquiry.subject}" from ${inquiry.email} deleted by ${req.user.name}`
    });

    res.json({ message: 'Inquiry removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
