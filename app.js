// load the .env variables
require('dotenv').config();
// avoid the try catch block in controllers
require('express-async-errors');

// express
const express = require('express');
const app = express();

// rest of the packages
const morgan = require('morgan');

// database
const connectDB = require('./db/connect');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


// logging request details
app.use(morgan('tiny'))
// It parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());

app.get('/', (req, res) => {
  res.send('e-commerce api');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
