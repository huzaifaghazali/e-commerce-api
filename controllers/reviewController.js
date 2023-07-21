const { StatusCodes } = require('http-status-codes');

const Review = require('../models/Review');
const Product = require('../models/Product');
const CustomError = require('../errors');

const { checkPermissions } = require('../utils');

const createReview = async (req, res) => {
  const { product: productId } = req.body;

  // Check if the product exist or not
  const isValidProduct = await Product.findOne({ _id: productId });

  // Throw error is product doesn't exist
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  // Check if user submitted the review for specific product
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });

  // Throw error if review is already submitted
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      'Already submitted review for this product'
    );
  }

  // Assigning userID to a request body i.e req.body.user user is from product model
  req.body.user = req.user.userId;

  // Create Review
  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });

  res.send('Create Review');
};

const getAllReviews = async (req, res) => {
  // Get all the reviews
  const reviews = await Review.find({});

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;

  // Get the specific review
  const review = await Review.findOne({ _id: reviewId });

  // Throw error if review is not present
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  res.send('Update Review');
};

const deleteReview = async (req, res) => {
  res.send('delete Review');
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};