'use strict';

const express = require('express');
const middleware = require('../middleware');
const controller = require('../controllers/items');
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
router.get('/', controller.getItems);

router.get('/:itemID', (req, res, next) => {
  res.json({message: 'Item retrieved successfully!', item: req.item})
});

// Post Routes
router.post('/', middleware.protected, controller.createItem);

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
