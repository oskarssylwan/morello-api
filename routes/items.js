'use strict';

const express = require('express');
const router = express.Router();

// Get Routes
router.get('/', (req, res, next) => {
  res.send('Welcome to /items');
});

router.get('/:itemID', (req, res, next) => {
  res.send(`The item you requested is: ${req.params.itemID}`);
});

// Post Routes
router.post('/', (req, res, next) => {
  res.json(req.body);
});

//Put Routes
router.put('/:itemID', (req, res, next) => {
  res.json(req.body);
});

// delete routes
router.delete('/:itemID', (req, res, next) => {
  res.json(req.body);
});


module.exports = router;
