const createOrder = async (req, res) => {
  res.send('Create an order');
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
