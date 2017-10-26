'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

//Static Methods
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email})
      .exec(function (error, user) {
        if(error) {
          return callback(error);
        } else if (!user) {
          const err = new Error('User not found');
          error.status = 401;
          return callback(error);
        }
        bcrypt.compare(password, user.password, function(error, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        });
      });
};

//Hooks
UserSchema.pre('save', function(next) {
  let user = this;
  if(user.password) {
    bcrypt.hash(user.password, 10, function(error, hashed) {
      if (error) {
        return next(error);
      } else {
        console.log(hashed);
        user.password = hashed;
          next();
      }
    });
  } else {
    next();
  }
});



// Models
const User = mongoose.model('User', UserSchema);

// Exports
module.exports = User;
