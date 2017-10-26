'use strict';

const express = require('express');
const router = express.Router();

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

// POST Routes
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

// PUT Routes
router.put('/:username', (req, res, next) => {
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
});

// Exports
module.exports = router;
