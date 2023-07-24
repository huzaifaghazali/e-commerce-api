const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide review title'],
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please provide review text'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);
// Compound index -> index that entails multiple fields
// User can give one review per product -> one user -> one review -> on one product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static methods -> we are not calling it on the instance that we create. We actually call it on the schema.
ReviewSchema.statics.calculateAverageRating = async function (productId) {
  console.log(productId);
};

// ***** Mongoose Middleware *****
// Pre-Save Hook: This middleware will be called before saving a new review document
ReviewSchema.post('save', async function () {
  // Calling the static methods
  await this.constructor.calculateAverageRating(this.product);
});
// Post-Save Hook: This middleware will be called after deleting a review document
ReviewSchema.post('remove', async function () {
  // Calling the static methods
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);
