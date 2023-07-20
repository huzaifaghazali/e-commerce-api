const { StatusCodes } = require('http-status-codes');

const Product = require('../models/Product');
const CustomError = require('../errors');

const createProduct = async (req, res) => {
  // Assigning userID to a request body i.e req.body.user user is from product model
  req.body.user = req.user.userId;

  // Create Product
  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  // Get all the products
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  // Get the product with specific ID
  const product = await Product.findOne({ _id: productId });

  // Throw error if product is not present
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;

  // Update the product
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  // Throw error if product is not present
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  // Get the product with specific ID
  const product = await Product.findOne({ _id: productId });

  // Throw error if product is not present
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }

  await product.remove();

  res.status(StatusCodes.OK).json({ msg: 'Success! Product Removed.' });
};

const uploadImage = async (req, res) => {
  res.send('upload image');
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
