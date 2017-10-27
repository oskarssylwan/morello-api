'use strict';

const express = require('express');
const middleware = require('../middleware');
const router = express.Router();
const webToken = require('jsonwebtoken');

// DB Models
const User = require('../models/user');

// Middleware
router.param('username', (req, res, next, username) => {
  User.findOne({username: username},  {password: 0, __v: 0}, (error, user) => {
    if (error) return next(error);
    if (!user) return next(new Error('User could not be found'));
    req.user = user;
    return next();
  });
});

// GET Routes
router.get('/:username', (req, res, next) => {
  res.json({message: 'User retrieved successfully!', user: req.user});
});

// POST Routes - Create User
router.post('/', (req, res, next) => {
  req.body.user_group = 'user';
  const user = new User(req.body);
  user.save((error, savedUser) => {
    if (error) return next(error);
    res.json({
      message: 'User created successfully!',
      user: {
        email: savedUser.email,
        username: savedUser.username,
        user_group: savedUser.user_group
      }
    });
  });
});

router.post('/authenticate', (req, res, next) => {
  const userID = req.body.email || req.body.username;
  User.authenticate(userID, req.body.password, (error, user) => {
    if(error) return next(error);
    const payload = {
      username: user.username,
      user_group: user.user_group
    };

    const token = webToken.sign(payload, 'morello', {
      expiresIn: "1 day" // 24 hours
    });

    res.json({
      message: "Authentication successfull!",
      token: token
    });

  })
});



// PUT Routes
router.put('/:username', middleware.protected, (req, res, next) => {
  if (req.token_decoded.username === req.user.username) {
    req.user.set(req.body);
    req.user.save((error, user) => {
      if (error) return next(error);

      res.json({
        message: 'Item updated successfully!',
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
});

// Exports
module.exports = router;
