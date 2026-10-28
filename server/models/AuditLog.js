import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  adminName: { type: String, required: true },
  adminEmail: { type: String, required: true },
  actionType: { 
    type: String, 
    required: true,
    enum: [
      'PRODUCT_ADDED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED',
      'INVENTORY_UPDATED', 'SIZE_TOGGLED', 'COLOR_TOGGLED',
      'ORDER_STATUS_UPDATED', 'DISCOUNT_APPLIED',
      'PAYMENT_VERIFIED', 'PAYMENT_REJECTED',
      'ANNOUNCEMENT_UPDATED',
      'ADMIN_PASSWORD_CHANGED'
    ]
  },
  targetType: { type: String, enum: ['Product', 'Order', 'Announcement', 'Admin'] },
  targetId: { type: String },
  targetName: { type: String },
  before: { type: mongoose.Schema.Types.Mixed },
  after: { type: mongoose.Schema.Types.Mixed },
  description: { type: String },
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
