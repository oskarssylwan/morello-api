'use strict';

// Imports
const express = require('express');
const middleware = require('../middleware');
const router = express.Router();
const controller = require('../controllers/users');



// Middleware
router.param('username', controller.findUser);

// Routes
router.get('/:username', controller.getUser);
router.post('/', controller.createUser);
router.post('/authenticate', controller.authenticateUser);
router.put('/:username', middleware.protected, controller.updateUser);

// Exports
module.exports = router;
