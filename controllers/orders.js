'use strict'

// Model
const Order = require('../models/order');


// Exports
module.exports = {

  // Route Methods

  getOrders: function(req, res, next) {
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
  },

  getUserOrders: function(req, res, next) {
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
  },

  createOrder:  function(req, res, next) {
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
  }

};
