'use strict';

const mongoose = require('mongoose');

// Schemas
const UserSchema = new mongoose.Schema({
  email: {
    type:     String,
    unique:   true,
    required: true,
    trim:     true
  },
  username: {
    type:     String,
    unique:   true,
    required: true,
    trim:     true
  },
  password: {
    type:     String,
    required: true
  },
  user_group: {
    type:     String,
    required: true
  },
  cart: {
    type: [{}],
    default: [{}]
  }
});


// Models
const User = mongoose.model('User', UserSchema);

// Exports
module.exports = User;
