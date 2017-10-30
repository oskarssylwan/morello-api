'use strict';

// Imports
const express = require('express');
const middleware = require('../middleware');
const controller = require('../controllers/items');
const router = express.Router();

// Middleware
router.param('itemID', controller.findItem);

// Routes
router.get('/', controller.getItems);
router.get('/:itemID', controller.getItem);
router.post('/', middleware.protected, controller.createItem);
router.put('/:itemID', middleware.protected, controller.updateItem);
router.delete('/:itemID', middleware.protected, controller.deleteItem);

// Exports
module.exports = router;
