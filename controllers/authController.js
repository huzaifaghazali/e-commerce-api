const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse } = require('../utils');

const register = async (req, res) => {
  const { email, name, password } = req.body;

  // Throw error if email is already registered
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // First Registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

  // Create User
  const user = await User.create({ name, email, password, role });

  // create token. payload what we will be sending
  const tokenUser = { name: user.name, userId: user._id, role: user.role };

  // Create cookie
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Throw error if email and password are empty
  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  // Find the user
  const user = await User.findOne({ email });

  // If User doesn't exist throw error
  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  // Compare the password
  const isPasswordCorrect = await user.comparePassword(password);

  // Throw error if password is incorrect
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  // create token. payload what we will be sending
  const tokenUser = { name: user.name, userId: user._id, role: user.role };

  // Create cookie
  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.send('logout user');
};

module.exports = {
  register,
  login,
  logout,
};
