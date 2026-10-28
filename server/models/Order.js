import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  image: { type: String },
  color: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderNumber: { type: String, unique: true },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, default: 'Pakistan' }
  },
  paymentMethod: { type: String, enum: ['COD', 'JazzCash'], required: true },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Pending Verification', 'Verified', 'Rejected'], 
    default: 'Pending' 
  },
  jazzCashScreenshot: { type: String },
  jazzCashTransactionId: { type: String },
  subtotal: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  adminNotes: { type: String, default: '' },
}, { timestamps: true });

orderSchema.pre('save', function() {
  if (!this.orderNumber) {
    this.orderNumber = 'TT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  }
});

export default mongoose.model('Order', orderSchema);
