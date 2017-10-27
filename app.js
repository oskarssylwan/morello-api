'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const webToken = require('jsonwebtoken');
const morgan = require('morgan');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Database Setup
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/morello', {useMongoClient: true});
const db = mongoose.connection;

db.on('error', (err) => {
  console.error('DB connection error:', err);
});


// Routes
const itemRoutes = require('./routes/items');
const userRoutes = require('./routes/users');
app.use('/items', itemRoutes);
app.use('/user', userRoutes);



// catch 404 and forward to error handler
app.use((req,res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// Port Setup
app.listen(3000, () => {
  console.log('Server running on port 3000');
})
