const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const authenticateUser = async(req, res, next) => {
   // Get the cookie named token
   const token = req.signedCookies.token;

   if(!token) {
      console.log('Error, no token present');
   } else {

      console.log('Token present');
   }
   next()// Go to the next middleware
}

module.exports = {
   authenticateUser
}