'use strict';

require('dotenv').config()
const config = require('./config.js');
const bodyParser = require('body-parser');
const webToken = require('jsonwebtoken');
const morgan = require('morgan');
const cors = require('cors');
const app = require('express')();


// Middleware
app.use(bodyParser.json({limit: config.payload_limit}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(cors());

// Database Setup
const mongoose = require('mongoose');
mongoose.connect(config.db_location, {useMongoClient: true});
const db = mongoose.connection;

db.on('error', (err) => {
  console.error('DB connection error:', err);
});

mongoose.Promise = global.Promise;

// Routes
app.use('/api', require('./api').router);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    success: false,
    message: error.message
  });
});

// Port Setup
app.listen(config.port, () => {
  console.log('Server running on port', config.port);
})
