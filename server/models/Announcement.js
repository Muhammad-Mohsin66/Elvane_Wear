import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  discountPercent: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Announcement', announcementSchema);
