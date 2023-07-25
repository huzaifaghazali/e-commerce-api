const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require('../controllers/orderController');

router
  .route('/')
  .post(authenticateUser, createOrder) // Authenticate(check if user is logged in or not) the user then create order
  .get(authenticateUser, authorizePermissions('admin'), getAllOrders); // Authenticate user then check if user is admin or not then get all the orders

router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders); // Authenticate the user then get the current orders

router
  .route('/:id')
  .get(authenticateUser, getSingleOrder) // Authenticate user then get single product
  .patch(authenticateUser, updateOrder); // Authenticate user then update the product

module.exports = router;
