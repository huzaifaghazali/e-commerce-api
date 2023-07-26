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

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
  // Get all the orders
  const orders = await Order.find({});

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { id: orderID } = req.params;

  // Get Order wth specific ID
  const order = await Order.findOne({ _id: orderID });

  // Throw error if order do not exist;
  if (!order) {
    throw new CustomError.NotFoundError(`No Order with id: ${orderID}`);
  }

  // Check the current user and user which is present on order user.
  checkPermissions(req.user, order.user);

  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  // Get all the order which are associated with the current user.
  const orders = await Order.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async (req, res) => {
  const { id: orderID } = req.params;
  const { paymentIntentId } = req.body;

  // Get Order wth specific ID
  const order = await Order.findOne({ _id: orderID });

  // Throw error if order do not exist;
  if (!order) {
    throw new CustomError.NotFoundError(`No Order with id: ${orderID}`);
  }

  // Check the current user and user which is present on order user.
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = 'paid';
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
