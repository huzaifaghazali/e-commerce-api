const { StatusCodes } = require('http-status-codes');
const path = require('path');

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

  // Get the product with specific ID and also get all reviews which are present on product
  const product = await Product.findOne({ _id: productId }).populate('reviews');

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

  await product.remove(); // Invoke the pre remove 

  res.status(StatusCodes.OK).json({ msg: 'Success! Product Removed.' });
};

const uploadImage = async (req, res) => {
  // check if file exists
  if (!req.files) {
    throw new CustomError.BadRequestError('No File Uploaded');
  }

  // Get the image from request files
  const productImage = req.files.image;

  // check image format Throw image if image  mimetype is not image
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('Please Upload Image');
  }

  // check size
  const maxSize = 1024 * 1024; // 1 Mb
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'Please Upload Image smaller than 1KB'
    );
  }

  // construct the image path
  const imagePath = path.join(
    __dirname, // get current directory
    `../public/uploads/${productImage.name}`
  );

  // move the image to the provided location
  await productImage.mv(imagePath);

  // return the image to the server
  return res
    .status(StatusCodes.OK)
    .json({ image: { src: `/uploads/${productImage.name}` } });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
