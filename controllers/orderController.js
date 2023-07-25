const { StatusCodes } = require('http-status-codes');

const Order = require('../models/Order');
const Product = require('../models/Product');
const CustomError = require('../errors');

const { checkPermissions } = require('../utils');

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'someRandomValue';
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  // Throw error if cart item doesn't exits or it's length is < 1
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('No cart items provided');
  }

  // Throw error if tax and shipping fee are does not exit
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      'Please provide tax and shipping fee'
    );
  }

  let orderItems = [];
  let subtotal = 0; // It is the price multiplied by quantity for every item

  // This loop gives the value in cartItems array
  for (const item of cartItems) {
    // Get the product whose ID matches with cartItem product ID
    const dbProduct = await Product.findOne({ _id: item.product });

    // Throw error if dbProduct do not exist;
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product with id: ${item.product}`
      );
    }

    // Access the product from the DB
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    // Add Item to order
    orderItems = [...orderItems, singleOrderItem];

    // Calculate subtotal
    subtotal += item.amount * price;
  }

  // Calculate total price
  const total = tax + shippingFee + subtotal;

  // Get Client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  });

  // Create an order
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
  res.send('Get All Orders');
};

const getSingleOrder = async (req, res) => {
  res.send('Get Single Orders');
};

const getCurrentUserOrders = async (req, res) => {
  res.send('Get Current User Orders');
};

const updateOrder = async (req, res) => {
  res.send('Update All Orders');
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
