const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');

const getAllUser = async (req, res) => {
  // Get all the users where role is user and don't select password
  const users = await User.find({ role: 'user' }).select('-password');

  res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req, res) => {
  // Get the user with specific ID without selecting password
  const user = await User.findOne({ _id: req.params.id }).select('-password');

  // Throw Error if the ID is not correct
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
  }

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  res.send(req.body);
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Throw error if email and password are empty
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError(
      'Please provide old password and new password'
    );
  }

  // Find the user with the given id
  const user = await User.findOne({ _id: req.user.userId });

  // Check if the enter old password is correct
  const isPasswordCorrect = await user.comparePassword(oldPassword);

  // throw error if the old password is incorrect
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  // Change the password
  user.password = newPassword;

  // method used on document when we want to create or update existing document
  await user.save();
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated!' });
};

module.exports = {
  getAllUser,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
