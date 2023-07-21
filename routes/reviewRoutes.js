const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

router
  .route('/')
  .post(authenticateUser, createReview) // Authenticate the user then submit review
  .get(getAllReviews);

router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUser, updateReview) // Authenticate the user then  update review
  .delete(authenticateUser, deleteReview); // Authenticate the user then  delete review

  module.exports = router;