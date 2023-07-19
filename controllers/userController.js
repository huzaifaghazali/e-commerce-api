const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} = require('../utils');

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

  // Check the user permission
  checkPermissions(req.user, user._id);

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

// Update user with user.save();
const updateUser = async (req, res) => {
  const { email, name } = req.body;

  // Throw error if email and name is empty
  if (!email || !name) {
    throw new CustomError.BadRequestError('Please provide all values');
  }

  // Update the user whose id is in the request user object
  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;

  await user.save(); // invoke the save mongoose middleware

  // Create Token user
  const tokenUser = createTokenUser(user);

  // Create a cookie name token
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

// update user with  findOneAndUpdate
/*
const updateUser = async (req, res) => {
  const { email, name } = req.body;

  // Throw error if email and name is empty
  if (!email || !name) {
    throw new CustomError.BadRequestError('Please provide all values');
  }

  // Update the user whose id is in the request user object
  const user = await User.findOneAndUpdate(
    { _id: req.user.userId },
    { email, name },
    { new: true, runValidators: true }
  );

  // Create Token user
  const tokenUser = createTokenUser(user);

  // Create a cookie name token
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};
*/

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
