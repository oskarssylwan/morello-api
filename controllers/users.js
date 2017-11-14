'use strict'

// Imports
const webToken = require('jsonwebtoken');
const config = require('../config');

// Model
const User = require('../models/user');


// Exports
module.exports = {

  // Param Id Methods

  findUser: function(req, res, next, username) {
    User.findOne({username: username},  {password: 0, __v: 0}, (error, user) => {
      if (error) return next(error);
      if (!user) return next(new Error('User could not be found'));
      req.user = user;
      return next();
    });
  },


  // Router Methods

  getUser: function(req, res, next) {
    res.json({
      success: true,
      message: 'User retrieved successfully!',
      user: req.user
    });
  },


  createUser: function(req, res, next) {
    req.body.user_group = 'user';
    const user = new User(req.body);
    user.save((error, savedUser) => {
      if (error) return next(error);
      res.json({
        success: true,
        message: 'User created successfully!',
        user: {
          email: savedUser.email,
          username: savedUser.username,
          user_group: savedUser.user_group
        }
      });
    });
  },


  updateUser: function(req, res, next) {
    if (req.token_decoded.username === req.user.username) {
      req.user.set(req.body);
      req.user.save((error, user) => {
        if (error) return next(error);

        res.json({
          success: true,
          message: 'User updated successfully!',
          user: {
            email: user.email,
            username: user.username,
            user_group: user.user_group,
            cart: user.cart
          }
        });
      });
    } else {
      const err = new Error('Access denied');
      return next(err);
    }
  },


  authenticateUser: function(req, res, next) {
    const userID = req.body.email || req.body.username;
    console.log(req.body);
    User.authenticate(userID, req.body.password, (error, user) => {
      if(error) {
        return next(error);
      } else {
        const payload = {
          username: user.username,
          user_id: user._id,
          user_group: user.user_group
        };

        const token = webToken.sign(payload, config.token_secret, {
          expiresIn: config.token_expire_time
        });

        res.json({
          success: true,
          message: "Authentication successfull!",
          token: token
        });
      }
    })
  }
};
