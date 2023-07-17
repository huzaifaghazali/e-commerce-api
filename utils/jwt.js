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

// Cookie
const attachCookiesToResponse = ({ res, user }) => {
  const token = createJWT({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;
  // Create a cookie name token
  res.cookie('token', token, {
    httpOnly: true, // cookie accessible only by the web server
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production', // restricts browsers to send cookies only over the the HTTPS.
    signed: true, // value is modified by the server using a secret key before being sent to the client.
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse
};
