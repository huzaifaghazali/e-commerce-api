const jwt = require('jsonwebtoken');

// Create Token
const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

  return token;
};

// Token validation
const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);


module.exports = {
   createJWT,
   isTokenValid,
}