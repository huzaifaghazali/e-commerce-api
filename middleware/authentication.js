const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

// Function to check user if it logged in or not
const authenticateUser = async (req, res, next) => {
  // Get the cookie named token
  const token = req.signedCookies.token;

  // Throw error if token not found
  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }

  try {
    const { name, userId, role } = isTokenValid({ token }); // verify the token
    req.user = { name, userId, role }; // Create request object named user
    next(); // Go to the next middleware
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

// Function to check the role of user
const authorizePermission = (req, res, next) => {
  if (req.user.role !== 'admin') {
    throw new CustomError.UnauthorizedError(
      'Unauthorized to access this route'
    );
  }
  next();
};

module.exports = {
  authenticateUser,
  authorizePermission,
};
