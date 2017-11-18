'use strict'

// Model
const Item = require('../models/item');




module.exports = {


  // Param Id Methods

  findItem: function(req, res, next, id) {
    Item.findById(id, (error, item) => {
      if (error) return next(error);
      if (!item) return next(new Error('Item could not be found'));
      req.item = item;
      return next();
    });
  },



  // Route Methods

  getItems: function(req, res, next) {
    if (!req.query.categories) return next(new Error('No category specified'));
    Item.find({ categories: { $all: req.query.categories.split(',')}}, (error, items) => {
        if (error) return next(error);
        if (items.length <= 0) return next(new Error('No items found'));
        res.json(items);
      }
     );
  },

  getItem: function(req, res, next) {
    res.json({
      success: true,
      message: 'Item retrieved successfully!',
      item: req.item
    })
  },

  createItem: function(req, res, next) {
    if (req.token_decoded.user_group === 'admin') {
      const item = new Item(req.body);
      item.save((error, itemEntry) => {
        if (error) next(error);
        res.json({
          success: true,
          message: 'Item created successfully!',
          item: item
        });
      })
    } else {
      const err = new Error('Access denied');
      return next(err);
    }
  },

  updateItem: function(req, res, next) {
    if (req.token_decoded.user_group === 'admin') {
      req.item.set(req.body);
      req.item.save((error, item) => {
        if (error) return next(error);

        res.json({
          success: true,
          message: 'Item updated successfully!',
          item: item
        });
      });
    } else {
      const err = new Error('Access denied');
      return next(err);
    }
  },

  deleteItem: function(req, res, next) {
    if (req.token_decoded.user_group === 'admin') {
      req.item.remove(error => {
        if (error) return next(error);
        res.json({
          success: true,
          message: "Item removed"
        });
      })
    } else {
      const err = new Error('Access denied');
      return next(err);
    }
  }

};
