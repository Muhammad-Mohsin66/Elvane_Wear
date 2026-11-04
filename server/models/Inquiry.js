import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  phone: { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: ['Pending', 'In Review', 'Resolved'],
    default: 'Pending',
  },
  adminNotes: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Inquiry', inquirySchema);
