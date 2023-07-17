const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async (req, res, next) => {
  // Get the cookie named token
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }

  try {
    const {name, userId, role} = isTokenValid({ token }); // verify the token

    // Create request object named user
    req.user = { name, userId, role}
    next(); // Go to the next middleware
  } catch (error) {}
};

module.exports = {
  authenticateUser,
};
