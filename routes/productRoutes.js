const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

// productController
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require('../controllers/productController');

router
  .route('/')
  .post([authenticateUser, authorizePermissions('admin')], createProduct) // Authenticate the user then check its role to create product
  .get(getAllProducts);

router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermissions('admin')], uploadImage);

router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions('admin')], updateProduct) // Authenticate the user then check its role to update product
  .delete([authenticateUser, authorizePermissions('admin')], deleteProduct); // Authenticate the user then check its role to delete product


module.exports = router;