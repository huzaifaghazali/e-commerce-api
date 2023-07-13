const mongoose = require('mongoose');

// remove the deprecation warning
mongoose.set("strictQuery", false);
const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;
