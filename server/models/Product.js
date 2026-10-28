import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hex: { type: String, required: true },
  active: { type: Boolean, default: true }
}, { _id: false });

const sizeSchema = new mongoose.Schema({
  name: { type: String, required: true, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  active: { type: Boolean, default: true }
}, { _id: false });

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'Essential Set', enum: ['Essential Set', 'Heavyweight Set', 'Velour Set', 'Cashmere Set', 'Limited Edition'] },
  fabric: { type: String, default: '' },
  care: { type: String, default: '' },
  images: [{ type: String }],
  colors: [colorSchema],
  sizes: [sizeSchema],
  inventoryCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

productSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.numReviews = 0;
  } else {
    this.averageRating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
};

export default mongoose.model('Product', productSchema);
