'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('../config.js');

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
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  }
});

//Static Methods
UserSchema.statics.authenticate = function(id, password, callback) {
  User.findOne({ $or: [{username: id}, {email: id}]})
      .exec(function (error, user) {
        console.log(user);
        if(error) {
          return callback(error);
        } else if (!user) {
          const err = new Error('User not found');
          err.status = 401;
          return callback(err);
        } else {
          bcrypt.compare(password, user.password, function(error, result) {
            if (result === true) {
              return callback(null, user);
            } else {
              return callback();
            }
          });
        }
      });
};

//Hooks
UserSchema.pre('save', function(next) {
  let user = this;
  if(user.password) {
    bcrypt.hash(user.password, config.hash_rounds, function(error, hashed) {
      if (error) {
        return next(error);
      } else {
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
