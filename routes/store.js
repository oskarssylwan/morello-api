'use strict';

const express = require('express');
const middleware = require('../middleware');
const router = express.Router();

//Models
const Order = require('../models/order');


// GET Order list
router.get('/', middleware.protected, (req, res, next) => {
  if(req.token_decoded.user_group === 'admin') {
    Order.find({}, (error, orders) => {
      if(error) {
        return next(error);
      } else {
        res.json({
          success: true,
          message: 'Orders retrieved successfully!',
          orders: orders
        });
      }
    });
  } else {
    const err = new Error('Access denied');
    return next(err);
  }
});

// GET specific order
router.get('/:userID', middleware.protected, (req, res, next) => {
  if (req.token_decoded.username === req.params.userID) {
    Order.find({made_by: req.params.userID}, (error, orders) => {
      if (error) {
        return next(error);
      } else if(!orders.length) {
        const err = new Error('No orders were found');
        return next(err);
      } else {
        res.json({
          success: true,
          message: "Order(s) retrieved successfully!",
          orders: orders
        });
      }
    });
  } else {
    const err = new Error('Access denied');
    return next(err);
  }
});

// Checkout
router.post('/checkout', middleware.protected, (req, res, next) => {

  // Create new order
  const order = new Order({
    made_by: req.token_decoded.username,
    items: req.body.cart
  })

  order.save(order, (error) => {
    if(error) {
      return next(error);
    } else {
      res.json({
        success: true,
        message: 'Order recieved successfully',
        order: order
      });
    }
  });
});



module.exports = router;
