const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // Remove the white space if present
      required: [true, 'Please provide product name'],
      maxlength: [100, 'Name can not be more than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
      maxlength: [1000, 'Description can not be more than 1000 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: ['office', 'kitchen', 'bedroom'],
    },
    company: {
      type: String,
      required: [true, 'Please provide company'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported', // value which is not present in enum values
      },
    },
    colors: {
      type: [String],
      default: ['#222'],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  // toJSON -> When the document is converted to JSON (i.e toJSON() or JSON.stringify()) the virtual properties defined in the schema will be included in the JSON representation.
  // toObject -> when the document is converted to a plain JavaScript object (i.e toObject()) the virtual properties will be included in the resulting object
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Defined virtual property called 'reviews' on the schema. Virtual properties are additional properties that do not exist in the actual MongoDB document but can be accessed as if they were real properties.

// Get the reviews associated with single product
ProductSchema.virtual('reviews', {
  ref: 'Review', // It should be populated using Review model. Review is reference to other model
  localField: '_id', // It will be populated based on matching the _id field of the current product with the 'product' field in the 'Review' model.
  foreignField: 'product', //  It means that the virtual property will be populated with reviews that have a matching 'product' field equal to the _id of the current product.
  justOne: false, // This indicates that the virtual property should be populated with an array of reviews.
});

// Mongoose middleware
// When product is deleted also delete the reviews which are associated with the product
ProductSchema.pre('remove', async function (next) {
  await this.model('Review').deleteMany({ product: this._id });
});

module.exports = mongoose.model('Product', ProductSchema);
