const { StatusCodes } = require('http-status-codes');

const Product = require('../models/Product');
const CustomError = require('../errors');

const createProduct = async (req, res) => {
  // Assigning userID to a request body i.e req.body.user user is from product model
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  res.send('get all products');
};

const getSingleProduct = async (req, res) => {
  res.send('get Single product');
};

const updateProduct = async (req, res) => {
  res.send('update product');
};

const deleteProduct = async (req, res) => {
  res.send('delete product');
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
