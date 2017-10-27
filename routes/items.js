'use strict';

const express = require('express');
const middleware = require('../middleware');
const router = express.Router();

// DB Models
const Item = require('../models/item');

//Middleware
router.param('itemID', (req, res, next, id) => {
  Item.findById(id, (error, item) => {
    if (error) return next(error);
    if (!item) return next(new Error('Item could not be found'));
    req.item = item;
    return next();
  });
});


// Get Routes
router.get('/', (req, res, next) => {
  if (!req.query.categories) return next(new Error('No category specified'));
  Item.find({ categories: { $all: req.query.categories.split(',')}}, (error, items) => {
      if (error) return next(error);
      if (items.length <= 0) return next(new Error('No items found'));
      res.json(items);
    }
   );
});

router.get('/:itemID', (req, res, next) => {
  res.json({message: 'Item retrieved successfully!', item: req.item})
});

// Post Routes
router.post('/', middleware.protected, (req, res, next) => {
  if (req.token_decoded.user_group === 'admin') {
    //Create DB entry for item
    const item = new Item(req.body);
    item.save((error, itemEntry) => {
      if (error) next(error);
      res.json({message: 'Item created successfully!', item: item});
    })
  } else {
    const err = new Error('Access denied');
    return next(err);
  }
});

//Put Routes
router.put('/:itemID', middleware.protected, (req, res, next) => {
  if (req.token_decoded.user_group === 'admin') {
    req.item.set(req.body);
    req.item.save((error, item) => {
      if (error) return next(error);

      res.json({message: 'Item updated successfully!', item: item});
    });
  } else {
    const err = new Error('Access denied');
    return next(err);
  }
});

// delete routes
router.delete('/:itemID', middleware.protected, (req, res, next) => {
  if (req.token_decoded.user_group === 'admin') {
    req.item.remove(error => {
      if (error) return next(error);
      res.json({message: "Item removed"});
    })
  } else {
    const err = new Error('Access denied');
    return next(err);
  }
});


module.exports = router;
