'use strict'

const Item = require('../models/item');




module.exports = {

  getItems: function(req, res, next) {
    if (!req.query.categories) return next(new Error('No category specified'));
    Item.find({ categories: { $all: req.query.categories.split(',')}}, (error, items) => {
        if (error) return next(error);
        if (items.length <= 0) return next(new Error('No items found'));
        res.json(items);
      }
     );
  },

  createItem: function(req, res, next) {
    if (req.token_decoded.user_group === 'admin') {
      const item = new Item(req.body);
      item.save((error, itemEntry) => {
        if (error) next(error);
        res.json({message: 'Item created successfully!', item: item});
      })
    } else {
      const err = new Error('Access denied');
      return next(err);
    }
  }

};
