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

ReviewSchema.post('save', async function () {
  // Calling the static methods
  await this.constructor.calculateAverageRating(this.product);
  console.log('post save hook called');
});

ReviewSchema.post('remove', async function () {
  // Calling the static methods
  await this.constructor.calculateAverageRating(this.product);
  console.log('post remove hook called');
});

module.exports = mongoose.model('Review', ReviewSchema);
