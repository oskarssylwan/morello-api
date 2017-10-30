'use strict';

// Imports
const express = require('express');
const middleware = require('../middleware');
const controller = require('../controllers/orders.js');
const router = express.Router();


// Routes
router.get('/', middleware.protected, controller.getOrders);
router.get('/:userID', middleware.protected, controller.getUserOrders);
router.post('/checkout', middleware.protected, controller.createOrder);


// Exports
module.exports = router;
