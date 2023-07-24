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
  
  // Aggregate Pipeline -> calculates the average rating and the number of reviews for the specified productId
  const result = await this.aggregate([
    { $match: { product: productId } }, // matches only the documents that have the specified productId
    {
      // groups the matched documents and calculates the average rating using the $avg operator on the rating field and the number of reviews using the $sum operator
      $group: {
        _id: null,
        averageRating: {
          $avg: '$rating',
        },
        numOfReviews: {
          $sum: 1,
        },
      },
    },
  ]);

  try {
    // Updates the Product model with specific ID
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0), // if result is empty then averageRating is 0
        numOfReviews:result[0]?.numOfReviews || 0, // if result is empty then numOfReviews is 0
      }
    );
  } catch (error) {
    console.log(error);
  }
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
